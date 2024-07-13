import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { cleanup } from "../../src/db/cleanup"

jest.setTimeout(500000)

const routePath = "/ezelectronics"
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
let customerCookie: string
let adminCookie: string

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

beforeAll(async ()=> {
    await cleanup()
    await postUser(admin)
    adminCookie = await login(admin)
})

afterAll(async ()=>{
    await cleanup()
})

describe("POST /users", () => {
    test("It should return a 200 success code and create a new user", async () => {
        await request(app).post(`${routePath}/users`) .send(customer).expect(200) 
        const users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(2)
        let cust = users.body.find((user: any) => user.username === customer.username)
        expect(cust).toBeDefined()
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)
        expect(cust.role).toBe(customer.role)
    })

    test("It should return a 422 error code if at least one request body parameter is empty/missing", async () => {
        await request(app).post(`${routePath}/users`).send({ username: "", name: "test", surname: "test", password: "test", role: "Customer" }).expect(422)
        await request(app).post(`${routePath}/users`).send({ username: "test", name: "", surname: "test", password: "test", role: "Customer" }).expect(422)
        await request(app).post(`${routePath}/users`).send({ username: "test", name: "test", surname: "", password: "test", role: "Customer" }).expect(422)
        await request(app).post(`${routePath}/users`).send({ username: "test", name: "test", surname: "test", password: "", role: "Customer" }).expect(422)
        //await request(app).post(`${routePath}/users`).send({ username: "test", name: "test", surname: "test", password: "test", role: "" }).expect(422)
    })

    test("It should return a 409 error code if a user with the same username exists",async()=>{
        await request(app).post(`${routePath}/users`).send(customer).expect(409)
    })
})

describe("GET /users", () => {
    test("It should return an array of users", async () => {
        const users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(2)
        let cust = users.body.find((user: any) => user.username === customer.username)
        expect(cust).toBeDefined()
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)
        expect(cust.role).toBe(customer.role)
        let adm = users.body.find((user: any) => user.username === admin.username)
        expect(adm).toBeDefined()
        expect(adm.name).toBe(admin.name)
        expect(adm.surname).toBe(admin.surname)
        expect(adm.role).toBe(admin.role)
    })

    test("It should return a 401 error code if the user is not an Admin", async () => {
        customerCookie = await login(customer)
        await request(app).get(`${routePath}/users`).set("Cookie", customerCookie).expect(401)
        await request(app).get(`${routePath}/users`).expect(401)
    })
})

describe("GET /users/roles/:role", () => {
    test("It should return an array of users with a specific role", async () => {
        const admins = await request(app).get(`${routePath}/users/roles/Admin`).set("Cookie", adminCookie).expect(200)
        expect(admins.body).toHaveLength(1)
        let adm = admins.body[0]
        expect(adm.username).toBe(admin.username)
        expect(adm.name).toBe(admin.name)
        expect(adm.surname).toBe(admin.surname)

        const customers = await request(app).get(`${routePath}/users/roles/Customer`).set("Cookie", adminCookie).expect(200)
        expect(customers.body).toHaveLength(1)
        let cust = customers.body[0]
        expect(cust.username).toBe(customer.username)
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)
    })

    test("It should fail if the role is not valid", async () => {
        await request(app).get(`${routePath}/users/roles/Invalid`).set("Cookie", adminCookie).expect(422)
    })

    test("It should return a 401 error code if the user is not an Admin", async ()=> {
        customerCookie = await login(customer)
        await request(app).get(`${routePath}/users/roles/Admin`).set("Cookie", customerCookie).expect(401)
        await request(app).get(`${routePath}/users/roles/Admin`).expect(401)
    })
})

describe("GET /users/:username",()=>{
    test("It should return a single user with a specific username", async()=>{
        let customers = await request(app).get(`${routePath}/users/customer`).set("Cookie", customerCookie).expect(200)
        expect(customers.body).toBeDefined()
        let cust = customers.body
        expect(cust.username).toBe(customer.username)
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)

        const admins = await request(app).get(`${routePath}/users/admin`).set("Cookie", adminCookie).expect(200)
        expect(customers.body).toBeDefined()
        let adm = customers.body
        expect(cust.username).toBe(customer.username)
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)

        customers = await request(app).get(`${routePath}/users/customer`).set("Cookie", adminCookie).expect(200)
        expect(customers.body).toBeDefined()
        cust = customers.body
        expect(cust.username).toBe(customer.username)
        expect(cust.name).toBe(customer.name)
        expect(cust.surname).toBe(customer.surname)
    })

    test("It should fail if the user does not exist",async()=>{
        await request(app).get(`${routePath}/users/notExisting`).set("Cookie", adminCookie).expect(404)
    })

    test("It should return a 401 error code if the user is not an Admin calling on other usernames", async ()=> {
        customerCookie = await login(customer)
        await request(app).get(`${routePath}/users/admin`).set("Cookie", customerCookie).expect(401)
        await request(app).get(`${routePath}/users/admin`).expect(401)
    })
})

describe("DELETE /users/:username",()=>{
    test("It should delete a single user with a specific username", async()=>{

        //delete customer as customer
        await request(app).delete(`${routePath}/users/customer`).set("Cookie", customerCookie).expect(200)
        let users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(1)

        //re add
        await request(app).post(`${routePath}/users`).send(customer).expect(200)

        //delete admin as admin
        await request(app).delete(`${routePath}/users/admin`).set("Cookie", adminCookie).expect(200)
        
        //re add
        await request(app).post(`${routePath}/users`).send(admin).expect(200)
        users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(2)

        //delete customer as admin
        await request(app).delete(`${routePath}/users/customer`).set("Cookie", adminCookie).expect(200)
        users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(1)

        //re add
        await request(app).post(`${routePath}/users`).send(customer).expect(200) 
    })

    test("It should fail if the user does not exist",async()=>{
        await request(app).delete(`${routePath}/users/notExisting`).set("Cookie", adminCookie).expect(404)
    })

    test("It should return a 401 error code if the user is not an Admin calling on other usernames", async ()=> {
        customerCookie = await login(customer)
        await request(app).delete(`${routePath}/users/admin`).set("Cookie", customerCookie).expect(401)
        await request(app).delete(`${routePath}/users/admin`).expect(401)
    })
})

describe("DELETE /users/",()=>{
    test("It should delete all users that are not admins", async()=>{

        //add second user
        await request(app).post(`${routePath}/users`).send({ username: "test", name: "test", surname: "test", password: "test", role: "Customer" }).expect(200)
        let users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(3)
        //delete
        await request(app).delete(`${routePath}/users/`).set("Cookie", adminCookie).expect(200)
        users = await request(app).get(`${routePath}/users`).set("Cookie", adminCookie).expect(200)
        expect(users.body).toHaveLength(1)

        //re add
        await request(app).post(`${routePath}/users`).send(customer).expect(200)
    })

    test("It should return a 401 error code if the user is not an Admin", async ()=> {
        customerCookie = await login(customer)
        await request(app).delete(`${routePath}/users/`).set("Cookie", customerCookie).expect(401)
        await request(app).delete(`${routePath}/users/`).expect(401)
    })
})

describe("PATCH /users/:username",()=>{
    test("It should update a single user with a specific username", async()=>{
        
        let customerM={address:"customer",birthdate:"2001-09-11", username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
        //update customer as customer
        let users = await request(app).patch(`${routePath}/users/customer`).set("Cookie", customerCookie).send(customerM).expect(200)
        expect(users.body).toBeDefined()
        let cust=users.body
        expect(cust.username).toBe(customer.username)
        expect(cust.address).toBe("customer")
        expect(cust.birthdate).toBe("2001-09-11")

        customerM={address:"customers",birthdate:"2001-09-12", username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
        //update customer as admin
        users = await request(app).patch(`${routePath}/users/customer`).set("Cookie", adminCookie).send(customerM).expect(200)
        expect(users.body).toBeDefined()
        cust=users.body
        expect(cust.username).toBe(customer.username)
        expect(cust.address).toBe("customers")
        expect(cust.birthdate).toBe("2001-09-12")

        let adminM={address:"admin",birthdate:"2001-09-11", username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
        //update admin as admin
        users = await request(app).patch(`${routePath}/users/admin`).set("Cookie", adminCookie).send(adminM).expect(200)
        expect(users.body).toBeDefined()
        let adm=users.body
        expect(adm.username).toBe(admin.username)
        expect(adm.address).toBe("admin")
        expect(adm.birthdate).toBe("2001-09-11")
    })

    test("It should return a 401 error code if the user is not logged in or not admin changing others", async ()=> {
        customerCookie = await login(customer)
        let adminM={address:"admin",birthdate:"2001-09-11", username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
        await request(app).patch(`${routePath}/users/admin`).set("Cookie", customerCookie).send(adminM).expect(401)
        let customerM={address:"customer",birthdate:"2001-09-11", username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
        await request(app).patch(`${routePath}/users/customer`).send(customerM).expect(401)
    })
})

describe("DELETE /sessions/current",()=>{
    test("It should log out the current user",async()=>{
        customerCookie = await login(customer)
        await request(app).delete(`${routePath}/sessions/current`).set("Cookie", customerCookie).expect(200)
    })
    test("401 user is not login", async () => {
        customerCookie = await login(customer)
        await request(app).delete(`${routePath}/sessions/current`).expect(401)
    })
})

describe("GET /sessions/current", () => {
    test("It should return the current user", async () => {
        customerCookie = await login(customer)
        const cus = await request(app).get(`${routePath}/sessions/current`).set("Cookie", customerCookie).expect(200)
        expect(cus.body.username).toBe(customer.username)
    })
    test("401 user is not login", async () => {
        customerCookie = await login(customer)
        const cus = await request(app).get(`${routePath}/sessions/current`).expect(401)
    })
})