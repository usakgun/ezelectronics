import ProductController from "../../src/controllers/productController";
import ProductDAO from "../../src/dao/productDAO";
import { beforeAll, test, describe, afterAll, afterEach, expect, jest } from "@jest/globals";
import { cleanup } from "../../src/db/cleanup";
import db from "../../src/db/db";
import { DateError } from "../../src/utilities";
import { ProductAlreadyExistsError, ProductNotFoundError, EmptyProductStockError, LowProductStockError } from "../../src/errors/productError";
import { Product } from "../../src/components/product";

jest.setTimeout(500000)

async function setup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO products VALUES ('HTC One X9', 'Laptop', 4, 57, '2024-05-01', '')");
            db.run("INSERT INTO products VALUES ('MSI', 'Laptop', 0, 57, '2024-05-01', '')");
            db.run("INSERT INTO products VALUES ('Samsung R860 Caliber', 'Laptop', 5, 74, '2024-05-01', '')", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

beforeAll(async () => {
    await cleanup();
    await setup();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const productController = new ProductController();

describe("Test registerProducts", () => {
    test("It should register a new product successfully", async () => {
        const registerProducts = jest.spyOn(ProductDAO.prototype, "registerProducts");
        try {
            await productController.registerProducts('Iphone13', 'Smartphone', 3, 'details', 100, '2024-06-02');
        } catch (error) {
            expect(error).toBeFalsy();
        }

        expect(registerProducts).toBeCalledTimes(1);
        expect(registerProducts).toBeCalledWith('Iphone13', 'Smartphone', 3, 'details', 100, '2024-06-02');
    });

    test("It should throw DateError", async () => {
        try {
            await productController.registerProducts('Iphone13', 'Smartphone', 3, 'details', 100, '2026-06-02');
        } catch (error) {
            expect(error).toBeInstanceOf(DateError);
        }
    });

    test("It should throw ProductAlreadyExistsError", async () => {
        try {
            await productController.registerProducts('HTC One X9', 'Laptop', 4, 'details', 57, '2024-05-01');
        } catch (error) {
            expect(error).toBeInstanceOf(ProductAlreadyExistsError);
        }
    });
});

describe("Test changeProductQuantity", () => {
    test("It should change the product quantity successfully", async () => {
        const changeProductQuantity = jest.spyOn(ProductDAO.prototype, "changeProductQuantity");
        const newQuantity = await productController.changeProductQuantity('HTC One X9', 2, '2024-05-10');
        expect(newQuantity).toBe(6);
        expect(changeProductQuantity).toBeCalledTimes(1);
        expect(changeProductQuantity).toBeCalledWith('HTC One X9', 6);
    });

    test("It should throw DateError for invalid date change", async () => {
        try {
            await productController.changeProductQuantity('HTC One X9', 2, '2026-05-10');
        } catch (error) {
            expect(error).toBeInstanceOf(DateError);
        }
    });
});

describe("Test sellProduct", () => {
    test("It should sell product successfully", async () => {
        const sellProduct = jest.spyOn(ProductDAO.prototype, "changeProductQuantity");
        const newQuantity = await productController.sellProduct('HTC One X9', 4, '2024-05-10');
        expect(newQuantity).toBe(2);
        expect(sellProduct).toBeCalledTimes(1);
        expect(sellProduct).toBeCalledWith('HTC One X9', 2);
    });

    test("It should throw EmptyProductStockError", async () => {
        try {
            await productController.sellProduct('MSI', 6, '2024-06-10');
        } catch (error) {
            expect(error).toBeInstanceOf(EmptyProductStockError);
        }
    });

    test("It should throw LowProductStockError", async () => {
        try {
            await productController.sellProduct('HTC One X9', 10, '2024-05-10');
        } catch (error) {
            expect(error).toBeInstanceOf(LowProductStockError);
        }
    });
});

describe("Test getProducts", () => {
    test("It should return all products", async () => {
        const products = await productController.getProducts(null, null, null);
        expect(products).toHaveLength(4);
    });

    test("It should return products by category", async () => {
        const products = await productController.getProducts('category', 'Laptop', null);
        expect(products).toHaveLength(3);
    });

    test("It should return product by model", async () => {
        const products = await productController.getProducts('model', null, 'HTC One X9');
        expect(products).toHaveLength(1);
        expect(products[0].model).toBe('HTC One X9');
    });
});

describe("Test getAvailableProducts", () => {
    test("It should return all available products", async () => {
        const products = await productController.getAvailableProducts(null, null, null);
        expect(products).toHaveLength(3);
    });

    test("It should return available products by category", async () => {
        const products = await productController.getAvailableProducts('category', 'Laptop', null);
        expect(products).toHaveLength(2);
    });

    test("It should return available product by model", async () => {
        const products = await productController.getAvailableProducts('model', null, 'HTC One X9');
        expect(products).toHaveLength(1);
        expect(products[0].model).toBe('HTC One X9');
    });
});

describe("Test deleteProduct", () => {
    test("It should delete the product successfully", async () => {
        const deleteProduct = jest.spyOn(ProductDAO.prototype, "deleteProduct");
        const result = await productController.deleteProduct('HTC One X9');
        expect(result).toBeTruthy();
        expect(deleteProduct).toBeCalledTimes(1);
        expect(deleteProduct).toBeCalledWith('HTC One X9');
    });

    test("It should throw ProductNotFoundError", async () => {
        try {
            await productController.deleteProduct('NonExistentProduct');
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError);
        }
    });
});

describe("Test deleteAllProducts", () => {
    test("It should delete all products successfully", async () => {
        const deleteAllProducts = jest.spyOn(ProductDAO.prototype, "deleteAllProducts");
        const result = await productController.deleteAllProducts();
        expect(result).toBeTruthy();
        expect(deleteAllProducts).toBeCalledTimes(1);
    });
});
