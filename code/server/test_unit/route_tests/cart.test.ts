import { test, expect, jest, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import controller from "../../src/controllers/cartController"
import Authenticator from "../../src/routers/auth"
const baseURL = "/ezelectronics/carts"

import { Cart, ProductInCart } from "../../src/components/cart"
import { Category } from "../../src/components/product"
jest.mock("../../src/routers/auth")

const testUnpaidCart=new Cart("test",false,"",100,[new ProductInCart("p1",2,Category.SMARTPHONE,40),new ProductInCart("p2",1,Category.APPLIANCE,20)])
const testPaidCart=new Cart("test",true,"2024-05-05",100,[new ProductInCart("p1",2,Category.SMARTPHONE,40),new ProductInCart("p2",1,Category.APPLIANCE,20)])

describe("GET", () => {
    test("getCart", async () => {
        const resolvedVal = testUnpaidCart
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "getCart").mockResolvedValueOnce(resolvedVal);
        const response = await request(app).get(baseURL).send();
        expect(response.status).toBe(200);
        expect(controller.prototype.getCart).toHaveBeenCalledTimes(1);
    });
});

describe("POST", () => {
    test("addToCart", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "addToCart").mockResolvedValueOnce(true);
        const response = await request(app).post(baseURL).send({model:"p1"});
        expect(response.status).toBe(200);
        expect(controller.prototype.addToCart).toHaveBeenCalledTimes(1);
    });
});

describe("PATCH ", () => {
    test("checkoutCart", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "checkoutCart").mockResolvedValueOnce(true);
        const response = await request(app).patch(baseURL).send();
        expect(response.status).toBe(200);
        expect(controller.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });
});

describe("GET", () => {
    test("getCustomerCarts", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "getCustomerCarts").mockResolvedValueOnce([testPaidCart]);
        const response = await request(app).get(baseURL+'/history').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    });
});

describe("DELETE", () => {
    test("removeProductFromCart", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
        const response = await request(app).delete(baseURL+'/products/p1').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });
});

describe("DELETE", () => {
    test("clearCart", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "clearCart").mockResolvedValueOnce(true);
        const response = await request(app).delete(baseURL+'/current').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.clearCart).toHaveBeenCalledTimes(1);
    });
});

describe("DELETE ", () => {
    test("deleteAllCarts", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
        const response = await request(app).delete(baseURL).send();
        expect(response.status).toBe(200);
        expect(controller.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });
});

describe("GET", () => {
    test("getAllCarts", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "getAllCarts").mockResolvedValueOnce([testPaidCart]);
        const response = await request(app).get(baseURL+'/all').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    });
});