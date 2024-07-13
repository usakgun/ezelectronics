import { describe, test, expect, beforeAll, afterEach, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../../index";
import { cleanup } from "../../src/db/cleanup";
import db from "../../src/db/db";

jest.setTimeout(500000)

async function setup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO products VALUES ('Realme X2', 'Laptop', 4, 57,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Samsung R860 Caliber', 'Laptop', 5, 74,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Tecno Pova', 'Smartphone', 3, 15,'2024-05-01','')");
            db.run("INSERT INTO carts VALUES (1, 'customer', 1, null, 867)");
            db.run("INSERT INTO cartProducts VALUES (1, 'Realme X2', 'Laptop', 4, 57)");
            db.run("INSERT INTO cartProducts VALUES (1, 'Samsung R860 Caliber', 'Laptop', 5, 74)", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

const routePath = "/ezelectronics";
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
let customerCookie: string;
let adminCookie: string;

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200);
};

const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.header["set-cookie"][0]);
            });
    });
};

beforeAll(async () => {
    await cleanup();
    await postUser(customer);
    await postUser(admin);
    customerCookie = await login(customer);
    adminCookie = await login(admin);
    await setup();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Product API Integration Tests", () => {
    describe("Product Routes", () => {
        test("POST /products should register new products", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: 10, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024-05-01" })
                .set("Cookie", adminCookie)
                .expect(200);
        });
        test("POST /products should return 422 for missing fields", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", quantity: 10, details: "Latest model" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("POST /products wrong date format", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: 10, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024 05 01" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("POST /products quantity < 0", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: -5, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024-05-01" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("POST /products price < 0", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: 5, details: "Latest model", sellingPrice: -999.99, arrivalDate: "2024-05-01" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("POST /products category not exist", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "notexist", quantity: 10, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024-05-01" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("POST /products 401 user not login", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: 10, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024-05-01" })
                .expect(401);
        });
        test("POST /products 401 user is customer", async () => {
            await request(app).post(`${routePath}/products`)
                .send({ model: "iPhone 13", category: "Smartphone", quantity: 10, details: "Latest model", sellingPrice: 999.99, arrivalDate: "2024-05-01" })
                .set("Cookie", customerCookie)
                .expect(401);
        });



        test("PATCH /products/:model should update product quantity", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2`)
                .send({ quantity: 5, changeDate: "2024-05-10" })
                .set("Cookie", adminCookie)
                .expect(200);
            expect(response.body.quantity).toBe(9);
        });
        test("PATCH /products/:model should return 404 for non-existing product", async () => {
            await request(app).patch(`${routePath}/products/NonExistentModel`)
                .send({ quantity: 5, changeDate: "2024-05-10" })
                .set("Cookie", adminCookie)
                .expect(404);
        });
        test("PATCH /products/:model 422 quantity < 0", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2`)
                .send({ quantity: -5, changeDate: "2024-05-10" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("PATCH /products/:model 422 wrong date format", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2`)
                .send({ quantity: 5, changeDate: "2024 05 10" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("PATCH /products/:model 401 user not login", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2`)
                .send({ quantity: 5, changeDate: "2024-05-10" })
                .expect(401);
        });
        test("PATCH /products/:model 401 user is cuustomer", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2`)
                .send({ quantity: 5, changeDate: "2024-05-10" })
                .set("Cookie", customerCookie)
                .expect(401);
        })



        test("PATCH /products/:model/sell should sell products and reduce quantity", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: 2, sellingDate: "2024-05-15" })
                .set("Cookie", adminCookie)
                .expect(200);
            expect(response.body.quantity).toBe(7);
        });
        test("PATCH /products/:model/sell should return 409 for selling more than available quantity", async () => {
            await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: 10, sellingDate: "2024-05-15" })
                .set("Cookie", adminCookie)
                .expect(409);
        });
        test("PATCH /products/:model/sell 422 quantity < 0", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: -2, sellingDate: "2024-05-15" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("PATCH /products/:model/sell 422 wrong date format", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: 2, sellingDate: "2024 05 15" })
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("PATCH /products/:model/sell 401 user not login", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: 2, sellingDate: "2024-05-15" })
                .expect(401);
        });
        test("PATCH /products/:model/sell 401 user is customer", async () => {
            const response = await request(app).patch(`${routePath}/products/Realme X2/sell`)
                .send({ quantity: 2, sellingDate: "2024-05-15" })
                .set("Cookie", customerCookie)
                .expect(401);
        });



        test("GET /products should return all products", async () => {
            const response = await request(app).get(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);
            expect(response.body).toHaveLength(4);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products?model=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products?category=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products?category=Laptop`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products?grouping=model&category=Laptop`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products?grouping=category&model=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products should return 401 for unauthorized access", async () => {
            await request(app).get(`${routePath}/products`)
                .expect(401);
        });
        test("GET /products should return 401 user is customer", async () => {
            await request(app).get(`${routePath}/products`)
                .set("Cookie", customerCookie)
                .expect(401);
        });



        test("GET /products/available should return all products", async () => {
            const response = await request(app).get(`${routePath}/products/available`)
                .set("Cookie", adminCookie)
                .expect(200);
            expect(response.body).toHaveLength(4);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products/available?model=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products/available?category=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products/available?category=Laptop`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products/available?grouping=model&category=Laptop`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products 422 worng querry parameter", async () => {
            const response = await request(app).get(`${routePath}/products/available?grouping=category&model=model`)
                .set("Cookie", adminCookie)
                .expect(422);
        });
        test("GET /products should return 401 for unauthorized access", async () => {
            await request(app).get(`${routePath}/products/available`)
                .expect(401);
        });



        test("DELETE /products/:model should delete a specific product", async () => {
            await request(app).delete(`${routePath}/products/Realme X2`)
                .set("Cookie", adminCookie)
                .expect(200);
        });
        test("DELETE /products/:model 401 user not login", async () => {
            await request(app).delete(`${routePath}/products/Realme X2`)
                .expect(401);
        });
        test("DELETE /products/:model 401 user is customer", async () => {
            await request(app).delete(`${routePath}/products/Realme X2`)
                .set("Cookie", customerCookie)
                .expect(401);
        });
        test("DELETE /products/:model should return 404 for non-existing product", async () => {
            await request(app).delete(`${routePath}/products/NonExistentModel`)
                .set("Cookie", adminCookie)
                .expect(404);
        });
        
        
        test("DELETE /products should delete all products", async () => {
            await request(app).delete(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);
        });
        test("DELETE /products 401 user not login", async () => {
            await request(app).delete(`${routePath}/products`)
                .expect(401);
        });
        test("DELETE /products 401 user is customer", async () => {
            await request(app).delete(`${routePath}/products`)
                .set("Cookie", customerCookie)
                .expect(401);
        });
    });
});
