import { test, expect, jest, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import UserController from "../../src/controllers/userController"
import { UserRoutes } from "../../src/routers/userRoutes"
import Authenticator from "../../src/routers/auth"
const baseURL = "/ezelectronics/users"

import { User, Role } from "../../src/components/user"
jest.mock("../../src/routers/auth")

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters

test("It should return a 200 success code", async () => {
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL).send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})

describe("GET /",()=>{
    test("Should call getUsers",async ()=>{
        const resolvedVal: User[] = [
            {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        ]
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"getUsers").mockResolvedValueOnce(resolvedVal)
        const response=await request(app).get(baseURL).send()
        expect(response.status).toBe(200)
        expect(UserController.prototype.getUsers).toBeCalledTimes(1)
    })
})

describe("GET /roles/:role",()=>{
    test("Should call getUsersByRole",async ()=>{
        const resolvedVal: User[] = [
            {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        ]
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"getUsersByRole").mockResolvedValueOnce(resolvedVal)
        const response=await request(app).get(baseURL+"/roles/Admin").send()
        expect(response.status).toBe(200)
        expect(UserController.prototype.getUsersByRole).toBeCalledTimes(1)
    })
    test("Should be stopped",async ()=>{
        const resolvedVal: User[] = [
            {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        ]
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"getUsersByRole").mockResolvedValueOnce(resolvedVal)
        const response=await request(app).get(baseURL+"/roles/AAdmin").send()
        expect(response.status).toBe(422)
        expect(UserController.prototype.getUsersByRole).toBeCalledTimes(1)
    })
})

describe("GET /:username",()=>{
    test("Should call getUserByUsername",async ()=>{
        const resolvedval: User = {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"getUserByUsername").mockResolvedValueOnce(resolvedval)
        const response=await request(app).get(baseURL+"/user3").send()
        expect(response.status).toBe(200)
        expect(UserController.prototype.getUserByUsername).toBeCalledTimes(1)
    })
})

describe("DELETE /:username",()=>{
    test("Should call deleteUser",async ()=>{
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"deleteUser").mockResolvedValueOnce(true)
        const response=await request(app).delete(baseURL+"/user3").send()
        expect(response.status).toBe(200)
        expect(UserController.prototype.deleteUser).toBeCalledTimes(1)
    })
})

describe("DELETE /",()=>{
    test("Should call deleteAll",async ()=>{
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"deleteAll").mockResolvedValueOnce(true)
        const response=await request(app).delete(baseURL).send()
        expect(response.status).toBe(200)
        expect(UserController.prototype.deleteAll).toBeCalledTimes(1)
    })
})

describe("PATCH /:username",()=>{
    test("Should call getUsers",async ()=>{
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "2024-05-25",
        }
        const resolvedVal: User = {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "A","birthdate": "2024-05-25"}
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(UserController.prototype,"updateUserInfo").mockResolvedValueOnce(resolvedVal)
        const response=await request(app).patch(baseURL+"/user3").send(testUser)
        expect(response.status).toBe(200)
        expect(UserController.prototype.updateUserInfo).toBeCalledTimes(1)
    })
})
