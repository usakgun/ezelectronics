import { test, expect, jest, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import ProductController from "../../src/controllers/productController"
import ProductRoutes from "../../src/routers/productRoutes"
import Authenticator from "../../src/routers/auth"

import { Product, Category } from "../../src/components/product"

const baseURL = "/ezelectronics/products"
jest.mock("../../src/routers/auth");

describe("POST /", () => {
    test("Should return a 200 success code", async () => {
        const testProduct = {
            model: "TestModel",
            category: Category.SMARTPHONE,
            quantity: 10,
            details: "Test product",
            sellingPrice: 500,
            arrivalDate: "2024-06-10"
        };
        
        jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce();

        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })

        const response = await request(app).post(baseURL).send(testProduct);

        expect(response.status).toBe(200);
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            testProduct.arrivalDate
        );
    });
});
describe("GET /", () => {
    test("Should return all products", async () => {
        const resolvedProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 10, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" },
            { model: "TestModel2", category: Category.LAPTOP, quantity: 5, details: "Test product 2", sellingPrice: 1000, arrivalDate: "2024-06-11" }
        ];

        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        const prod = jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(resolvedProducts);
        
        const response = await request(app).get(baseURL);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedProducts);
        expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
        prod.mockRestore();
    });
    test("Should return products by model", async () => {
        const resolvedProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 10, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" },
            { model: "TestModel2", category: Category.LAPTOP, quantity: 5, details: "Test product 2", sellingPrice: 1000, arrivalDate: "2024-06-11" }
        ];

        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        const prod = jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(resolvedProducts);
        
        const response = await request(app).get(baseURL).query({ grouping: 'model', model: 'TestModel1' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedProducts);
        expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.getProducts).toHaveBeenCalledWith('model', undefined, 'TestModel1');
        prod.mockRestore();
    });
    test("Should return products by category", async () => {
        const resolvedProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 10, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" },
            { model: "TestModel2", category: Category.LAPTOP, quantity: 5, details: "Test product 2", sellingPrice: 1000, arrivalDate: "2024-06-11" }
        ];

        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        const prod = jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(resolvedProducts);
        
        const response = await request(app).get(baseURL).query({ grouping: 'category', category: Category.LAPTOP });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedProducts);
        expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.getProducts).toHaveBeenCalledWith('category', Category.LAPTOP, undefined);
        prod.mockRestore();
    });
});

describe("GET /available", () => {
    test("Should return available products", async () => {
        const resolvedAvailableProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 5, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" }
        ];
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })

        const available = jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(resolvedAvailableProducts);

        const response = await request(app).get(`${baseURL}/available`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedAvailableProducts);
        expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        
        available.mockRestore();
    });
    test("Should return available products by model", async () => {
        const resolvedAvailableProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 5, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" }
        ];
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })

        const available = jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(resolvedAvailableProducts);

        const response = await request(app).get(`${baseURL}/available`).query({ grouping: 'model', model: 'TestModel1' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedAvailableProducts);
        expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith('model', undefined, 'TestModel1');
        available.mockRestore();
    });
    test("Should return available products by category", async () => {
        const resolvedAvailableProducts: Product[] = [
            { model: "TestModel1", category: Category.SMARTPHONE, quantity: 5, details: "Test product 1", sellingPrice: 500, arrivalDate: "2024-06-10" }
        ];
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })

        const available = jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(resolvedAvailableProducts);

        const response = await request(app).get(`${baseURL}/available`).query({ grouping: 'category', category: Category.LAPTOP });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resolvedAvailableProducts);
        expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith('category', Category.LAPTOP, undefined);
        available.mockRestore();
    });
});

describe("PATCH /:model", () => {
    test("Should update product quantity", async () => {
        const updatedQuantity = 15;
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(updatedQuantity);

        const response = await request(app).patch(`${baseURL}/TestModel1`).send({ quantity: 5,changeDate: '' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ quantity: updatedQuantity });
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith("TestModel1", 5, '');
    });
});

describe("PATCH /:model/sell", () => {
    test("Should sell product and update quantity", async () => {
        const updatedQuantity = 3;
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(updatedQuantity);

        const response = await request(app).patch(`${baseURL}/TestModel1/sell`).send({ quantity: 2 ,sellingDate: ''});
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ quantity: updatedQuantity });
        expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith("TestModel1", 2, '');
    });
});

describe("DELETE /", () => {
    test("Should delete all products", async () => {
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(true);

        const response = await request(app).delete(baseURL);
        
        expect(response.status).toBe(200);
        expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
    });
});

describe("DELETE /:model", () => {
    test("Should delete product by model", async () => {
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req,res,next)=>{
            return next()
        })
        jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(true);

        const response = await request(app).delete(`${baseURL}/TestModel1`);
        
        expect(response.status).toBe(200);
        expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1);
        expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith("TestModel1");
    });
});


