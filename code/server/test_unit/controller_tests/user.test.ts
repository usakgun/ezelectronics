import { test, expect, jest } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { describe } from "node:test";
import { Role, User } from "../../src/components/user";
import { UnauthorizedUserError, UserIsAdminError, UserNotAdminError } from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")

//Example of a unit test for the createUser method of the UserController
//The test checks if the method returns true when the DAO method returns true
//The test also expects the DAO method to be called once with the correct parameters

const controller = new UserController(); //Create a new instance of the controller

test("It should return true", async () => {
    const testUser = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
    //Call the createUser method of the controller with the test user object
    const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role);
    expect(response).toBe(true); //Check if the response is true
});

//getUsers()
test("getUsers", async ()=>{
    const expected:User[]=[
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    ]
    jest.spyOn(UserDAO.prototype,"getUsers").mockResolvedValueOnce([
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    ])

    const response=await controller.getUsers();
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1)
})

//getUsersByRole()
test("getUsersByRole", async ()=>{
    const expected:User[]=[
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    ]
    jest.spyOn(UserDAO.prototype,"getUserByRole").mockResolvedValueOnce([
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    ])

    const response=await controller.getUsersByRole(Role.ADMIN);
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.getUserByRole).toHaveBeenCalledTimes(1)
    expect(UserDAO.prototype.getUserByRole).toHaveBeenCalledWith(Role.ADMIN)
})

//getUserByUsername()
test("getUserByUsername success", async ()=>{
    const expected:User={"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    const mockUser:User=new User("user1","user1","user1",Role.ADMIN,"","")
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    const response=await controller.getUserByUsername(mockUser,"user3");
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1)
    expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith("user3")
})
test("getUserByUsername unauthorized", async ()=>{
    const mockUser:User=new User("user1","user1","user1",Role.CUSTOMER,"","")
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    let response
    try {
        response=await controller.getUserByUsername(mockUser,"user3");
    } catch(error) {
        response=error
    }
    expect(response).toEqual(new UnauthorizedUserError)
})

//deleteUser()
test("deleteUser success", async ()=>{
    const expected:boolean=true
    const mockUser:User=new User("user1","user1","user1",Role.ADMIN,"","")
    jest.spyOn(UserDAO.prototype,"deleteUSer").mockResolvedValueOnce(true)
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(
        {"username": "user1","name": "user1","surname": "user1","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    const response=await controller.deleteUser(mockUser,"user1");
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.deleteUSer).toHaveBeenCalledTimes(1)
    expect(UserDAO.prototype.deleteUSer).toHaveBeenCalledWith("user1")
})
test("deleteUser admin error", async ()=>{
    const mockUser:User=new User("user1","user1","user1",Role.ADMIN,"","")
    jest.spyOn(UserDAO.prototype,"deleteUSer").mockResolvedValueOnce(true)
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    let response
    try {
        response=await controller.deleteUser(mockUser,"user3");
    } catch(error) {
        response=error
    }
    expect(response).toEqual(new UserIsAdminError)
})
test("deleteUser not admin error", async ()=>{
    const mockUser:User=new User("user1","user1","user1",Role.CUSTOMER,"","")
    jest.spyOn(UserDAO.prototype,"deleteUSer").mockResolvedValueOnce(true)
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    let response
    try {
        response=await controller.deleteUser(mockUser,"user3");
    } catch(error) {
        response=error
    }
    expect(response).toEqual(new UserNotAdminError)
})

//deleteAll()
test("deletAll", async ()=>{
    const expected:boolean=true
    jest.spyOn(UserDAO.prototype,"deleteAll").mockResolvedValueOnce(true)
    const response=await controller.deleteAll();
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.deleteAll).toHaveBeenCalledTimes(1)
})

//updateUserInfo()
test("updateUserInfo success", async ()=>{
    const expected:User={"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    const mockUser:User=new User("user1","user1","user1",Role.ADMIN,"","")
    jest.spyOn(UserDAO.prototype,"updateUser").mockResolvedValueOnce(true)
    jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValue(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    const response=await controller.updateUserInfo(mockUser,"admin","admin","","","user3");
    expect(response).toEqual(expected)
    expect(UserDAO.prototype.updateUser).toHaveBeenCalledTimes(1)
    expect(UserDAO.prototype.updateUser).toHaveBeenCalledWith("admin","admin","","","user3")
})
test("updateUserInfo unauthorized", async ()=>{
    const mockUser:User=new User("user1","user1","user1",Role.CUSTOMER,"","")
    jest.spyOn(UserDAO.prototype,"updateUser").mockResolvedValueOnce(false)
    const mockUserByUsername=jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValue(
        {"username": "user3","name": "admin","surname": "admin","role": Role.ADMIN,"address": "","birthdate": ""}
    )
    let response
    try {
        response=await controller.updateUserInfo(mockUser,"admin","admin","","","user3");
    } catch(error) {
        response=error
    }
    expect(response).toEqual(new UnauthorizedUserError)
    mockUserByUsername.mockRestore()
})