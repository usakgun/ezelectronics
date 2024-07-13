import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import { cleanup } from "../../src/db/cleanup"
import UserController from "../../src/controllers/userController"
import { Role, User } from "../../src/components/user"

jest.setTimeout(500000)

const controller=new UserController()
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const customerU = new User(customer.username,customer.name,customer.surname,Role.CUSTOMER,"","")
const adminU= new User(admin.username,admin.name,admin.surname,Role.ADMIN,"","")

const addUser = async (userInfo: any) => {
    await controller.createUser(userInfo.username,userInfo.name,userInfo.surname,userInfo.password,userInfo.role)
}

beforeAll(async ()=> {
    await cleanup()
    await addUser(admin)
})

afterAll(async ()=>{
    await cleanup()
})

describe("createUser",()=>{
    test("Should resolve to true",async()=>{
        await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)
        const users=await controller.getUsers()
        expect(users).toHaveLength(2)
        expect(users.find((u)=>u.username==customer.username)).toBeDefined()
    })

    test("Should return 409 username already used",async()=>{
        try {
            await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})

describe("getUsers",()=>{
    test("Should resolve to array of users",async()=>{
        const users=await controller.getUsers()
        expect(users).toHaveLength(2)
        expect(users.find((u)=>u.username==customer.username)).toBeDefined()
    })
})

describe("getUsersByRole",()=>{
    test("Should resolve to array of specific role",async()=>{
        const customers=await controller.getUsersByRole("Customer")
        expect(customers).toHaveLength(1)
        const admins=await controller.getUsersByRole("Admin")
        expect(admins).toHaveLength(1)
    })
})

describe("getUsersByUsername",()=>{
    test("Should resolve to specific user",async()=>{
        let cust=await controller.getUserByUsername(customerU,"customer")
        expect(cust).toBeDefined()
        expect(cust.username).toBe("customer")
        cust=await controller.getUserByUsername(adminU,"customer")
        expect(cust).toBeDefined()
        expect(cust.username).toBe("customer")
        const adm=await controller.getUserByUsername(adminU,"admin")
        expect(adm).toBeDefined()
        expect(adm.username).toBe("admin")
    })

    test("Should throw error not authorised",async()=>{
        try {
            const adm=await controller.getUserByUsername(customerU,"admin")
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})

describe("deleteUser",()=>{
    test("Should resolve to true",async()=>{
        //delete
        await controller.deleteUser(customerU,"customer")
        let users=await controller.getUsers()
        expect(users).toHaveLength(1)
        expect(users.find((u)=>u.username==customer.username)).not.toBeDefined()
        //re add
        await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)

        //delete
        await controller.deleteUser(adminU,"admin")
        users=await controller.getUsers()
        expect(users).toHaveLength(1)
        expect(users.find((u)=>u.username==admin.username)).not.toBeDefined()
        //re add
        await controller.createUser(admin.username,admin.name,admin.surname,admin.password,admin.role)
    
        //delete
        await controller.deleteUser(adminU,"customer")
        users=await controller.getUsers()
        expect(users).toHaveLength(1)
        expect(users.find((u)=>u.username==customer.username)).not.toBeDefined()
        //re add
        await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)
    })

    test("Should throw error not authorised",async()=>{
        try {
            await controller.deleteUser(customerU,"admin")
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})

describe("deleteAll",()=>{
    test("Should resolve to true",async()=>{
        //delete
        await controller.deleteAll()
        let users=await controller.getUsers()
        expect(users).toHaveLength(1)
        expect(users.find((u)=>u.username==customer.username)).not.toBeDefined()
        //re add
        await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)

        await controller.createUser("customer2",customer.name,customer.surname,customer.password,customer.role)
        await controller.deleteAll()
        users=await controller.getUsers()
        expect(users).toHaveLength(1)
        expect(users.find((u)=>u.username==customer.username)).not.toBeDefined()
        expect(users.find((u)=>u.username=="customer2")).not.toBeDefined()
        expect(users.find((u)=>u.username==admin.username)).toBeDefined()
        //re add
        await controller.createUser(customer.username,customer.name,customer.surname,customer.password,customer.role)
    })
})

describe("updateUser",()=>{
    test("Should resolve to updated user",async()=>{
        await controller.updateUserInfo(customerU,"customer2",customer.surname,"","",customer.username)
        let users=await controller.getUsers()
        expect(users.find((u)=>u.username==customer.username)?.name).toBe("customer2")

        await controller.updateUserInfo(adminU,"admin2",admin.surname,"","",admin.username)
        users=await controller.getUsers()
        expect(users.find((u)=>u.username==admin.username)?.name).toBe("admin2")
    })

    test("Should throw error not authorised",async()=>{
        try {
            await controller.updateUserInfo(customerU,admin.name,admin.surname,"","",admin.username)
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})