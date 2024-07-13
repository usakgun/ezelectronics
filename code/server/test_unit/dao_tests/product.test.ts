import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import productController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database, ERROR } from "sqlite3"
import { Category, Product } from "../../src/components/product"
import { ProductAlreadyExistsError ,ProductNotFoundError } from "../../src/errors/productError"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

const productDAO = new ProductDAO()

afterAll(() => {
    jest.restoreAllMocks();
});

describe("ProductDAO", () => {
    describe("registerProducts()", () => {
        test("Should register product successfully", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as any;
            });

            const result = await productDAO.registerProducts("model1", "category1", 10, "details", 100, "2024-06-10");

            expect(result).toBe(true);
            expect(mockDBRun).toHaveBeenCalled();
        });
        test("Should reject with ProductAlreadyExistsError", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(new Error("UNIQUE constraint failed: products.model"));
                return {} as any;
            });

            await expect(productDAO.registerProducts("existingModel", "category1", 10, "details", 100, "2024-06-10"))
                .rejects.toThrow(ProductAlreadyExistsError);

            expect(mockDBRun).toHaveBeenCalled();
        });
    });
    describe("getProduct()", () => {
        test("Should get product by model successfully", async () => {
            const expected = new Product(100, "model1", Category.LAPTOP, "2024-06-10", "details", 10);

            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, { sellingPrice: 100, model: "model1", category: "Laptop", arrivalDate: "2024-06-10", details: "details", quantity: 10 });
                return {} as any;
            });

            const result = await productDAO.getProduct("model1");

            expect(result).toEqual(expected);
            expect(mockDBGet).toHaveBeenCalled();
        });
        test("Should reject with ProductNotFoundError", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
                return {} as any;
            });

            await expect(productDAO.getProduct("nonexistentModel")).rejects.toThrow(ProductNotFoundError);

            expect(mockDBGet).toHaveBeenCalled();
        });
    });
    describe("getAllProducts()", () => {
        test("Should get all products", async () => {
            const expected: Product[] = [
                new Product(100, "model1", Category.LAPTOP, "2024-06-10", "details", 10),
                new Product(200, "model2", Category.SMARTPHONE, "2024-06-10", "details", 20)
            ];

            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, [
                    { sellingPrice: 100, model: "model1", category: "Laptop", arrivalDate: "2024-06-10", details: "details", quantity: 10 },
                    { sellingPrice: 200, model: "model2", category: "Smartphone", arrivalDate: "2024-06-10", details: "details", quantity: 20 }
                ]);
                return {} as any;
            });

            const result = await productDAO.getAllProducts();

            expect(result).toEqual(expected);
            expect(mockDBAll).toHaveBeenCalled();
        });
        test("Should reject with ProductNotFoundError", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, []);
                return {} as any;
            });

            await expect(productDAO.getAllProducts()).resolves.toEqual([]);

            expect(mockDBAll).toHaveBeenCalled();
        });
    });
    describe("getProductsByCategory()", () => {
        test("Should get products by category successfully", async () => {
            const expected: Product[] = [
                new Product(100, "model1", Category.LAPTOP, "2024-06-10", "details", 10),
                new Product(200, "model2", Category.LAPTOP, "2024-06-10", "details", 20)
            ];
    
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, [
                    { sellingPrice: 100, model: "model1", category: "Laptop", arrivalDate: "2024-06-10", details: "details", quantity: 10 },
                    { sellingPrice: 200, model: "model2", category: "Laptop", arrivalDate: "2024-06-10", details: "details", quantity: 20 }
                ]);
                return {} as any;
            });
    
            const result = await productDAO.getProductsByCategory("LAPTOP");
    
            expect(result).toEqual(expected);
            expect(mockDBAll).toHaveBeenCalled();
        });
        test("Should reject with ProductNotFoundError", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, []);
                return {} as any;
            });
    
            await expect(productDAO.getProductsByCategory("nonexistentCategory")).resolves.toEqual([]);
    
            expect(mockDBAll).toHaveBeenCalled();
        });
    });
    describe("changeProductQuantity()", () => {
        test("Should change product quantity successfully", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as any;
            });
    
            const result = await productDAO.changeProductQuantity("model1", 15);
    
            expect(result).toBe(true);
            expect(mockDBRun).toHaveBeenCalled();
        });
    });
    describe("deleteProduct()", () => {
        test("Should delete product by model successfully", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as any;
            });
    
            const result = await productDAO.deleteProduct("model1");
    
            expect(result).toBe(true);
            expect(mockDBRun).toHaveBeenCalled();
        });
    
    });
    describe("deleteAllProducts()", () => {
        test("Should delete all products successfully", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null);
                return {} as any;
            });
    
            const result = await productDAO.deleteAllProducts();
    
            expect(result).toBe(true);
            expect(mockDBRun).toHaveBeenCalled();
        });
    });
    
});