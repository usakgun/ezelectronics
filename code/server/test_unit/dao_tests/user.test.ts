import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database, ERROR } from "sqlite3"
import { User, Role } from "../../src/components/user"
import { UserNotFoundError } from "../../src/errors/userError"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true

const userDAO = new UserDAO()

test("It should resolve true", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
        return (Buffer.from("salt"))
    })
    const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
        return Buffer.from("hashedPassword")
    })
    const result = await userDAO.createUser("username", "name", "surname", "password", "role")
    expect(result).toBe(true)
    mockRandomBytes.mockRestore()
    mockDBRun.mockRestore()
    mockScrypt.mockRestore()
})

describe("getUsers()", ()=>{
    test("Should get single user", async ()=> {
        const expected: User[] = [
            {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        ]
        const mockDBAll = jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
            const rows=[
                {"username": "user3","name": "admin","surname": "admin","role": "Admin","address": "","birthdate": ""}
            ]
            const err: Error|null=null
            callback(err,rows)
            return {} as Database
        })
        const result = await userDAO.getUsers()
        expect(result).toEqual(expected)
        mockDBAll.mockRestore()
    })

    // test("Should get empty array", async()=> {
    //     const expected: User[] = []
    //     const mockDBAll = jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
    //         const rows:any=[]
    //         const err: Error|null=null
    //         callback(err,rows)
    //         return {} as Database
    //     })
    //     const result = await userDAO.getUsers()
    //     expect(result).toEqual(expected)
    //     mockDBAll.mockRestore()
    // })

    // test("Should get more than one", async ()=>{
    //     const expected: User[] = [
    //         {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""},
    //         {"username": "user2","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    //     ]
    //     const mockDBAll = jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
    //         const rows=[
    //             {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""},
    //             {"username": "user2","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    //         ]
    //         const err: Error|null=null
    //         callback(err,rows)
    //         return {} as Database
    //     })
    //     const result = await userDAO.getUsers()
    //     expect(result).toEqual(expected)
    //     mockDBAll.mockRestore()
    // })

    test("Should get error", async()=> {
        const expected: Error=new Error("DB error")
        const mockDBAll = jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
            const rows:any=[]
            const err: Error|null=new Error("DB Error")
            callback(err,rows)
            return {} as Database
        })
        let result
        try {
            result = await userDAO.getUsers()
        } catch(error) {
            result=error
        }
        expect(result).toEqual(new Error("DB Error"))
        mockDBAll.mockRestore()
    })
})

describe("getUserByRole(role)", ()=>{
    test("Should get managers", async ()=>{
        const expected:User[]=[]
        const mockDBGet=jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
            const rows:any=[]
            const err:Error|null=null
            callback(err,rows)
            return {} as Database
        })
        const result=await userDAO.getUserByRole("Admin")
        expect(result).toEqual(expected)
        mockDBGet.mockRestore()
    })
})

describe("getUserByUsername()", ()=>{
    test("Should get user", async ()=> {
        const expected: User={"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
        const mockDBGet = jest.spyOn(db,"get").mockImplementation((sql,params,callback)=>{
            const row={"username": "user3","name": "admin","surname": "admin","role": "Admin","address": "","birthdate": ""}
            const err: Error|null=null
            callback(err,row)
            return {} as Database
        })
        const result = await userDAO.getUserByUsername("user3")
        expect(result).toEqual(expected)
        mockDBGet.mockRestore()
    })
})

describe("deleteUser(username)",()=>{
    test("Should get true", async ()=>{
        const mockDBRun=jest.spyOn(db,"run").mockImplementation((sql,params,callback)=>{
            const err:Error|null=null
            params=[]
            callback(err)
            return {} as Database
        })
        const result=await userDAO.deleteUSer("User")
        expect(result).toBe(true)
    })

    test("Should get error", async ()=>{
        const mockDBRun=jest.spyOn(db,"run").mockImplementation((sql,params,callback)=>{
            const err:Error|null=Error("DB error")
            callback(err)
            return {} as Database
        })
        let result
        try {
            result=await userDAO.deleteUSer("User")
        } catch(error) {
            result=error
        }
        expect(result).toEqual(new Error("DB error"))
    })
})

describe("deleteAll()",()=>{
    test("Should get true", async ()=>{
        const mockDBRun=jest.spyOn(db,"run").mockImplementation((sql,params,callback)=>{
            const err:Error|null=null
            params=[]
            callback(err)
            return {} as Database
        })
        const result=await userDAO.deleteAll()
        expect(result).toBe(true)
    })
})

describe("updateUser()", ()=>{
    test("Should get updated user", async ()=> {
        const mockDBAll = jest.spyOn(db,"run").mockImplementation((sql,params,callback)=>{
            const err: Error|null=null
            callback(err)
            return {} as Database
        })
        const result = await userDAO.updateUser("admin","admin","","","user3")
        expect(result).toBe(true)
        mockDBAll.mockRestore()
    })
})