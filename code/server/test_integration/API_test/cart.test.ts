import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { cleanup } from "../../src/db/cleanup"
import db from "../../src/db/db"

jest.setTimeout(500000)

async function setup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO products VALUES ('Sony Ericsson V640', 'Appliance', 0, 78,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Realme X2', 'Laptop', 3, 57,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Samsung R860 Caliber', 'Laptop', 5, 74,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Tecno Pova', 'Smartphone', 3, 15,'2024-05-01','')", (err) => {
                if (err) reject(err)
                else resolve()
            })
        });
    })
}

async function cleanupCart() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("DELETE FROM carts")
            db.run("DELETE FROM cartProducts", (err) => {
                if (err) reject(err)
                resolve()
            })
        });
    })
}

async function setupCart() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO carts VALUES (1, 'customer', 0, null, 57)");
            db.run("INSERT INTO cartProducts VALUES (1, 'Realme X2', 'Laptop', 1, 57)");
            db.run("INSERT INTO carts VALUES (2, 'customer', 1, '15-06-2024', 57)");
            db.run("INSERT INTO cartProducts VALUES (2, 'Tecno Pova', 'Smartphone', 1, 15)", err => {
                if (err) reject(err)
                else resolve()
            });
        });
    })
}

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

beforeAll(async () => {
    await cleanup();
    await postUser(customer)
    await postUser(admin)
    customerCookie = await login(customer)
    adminCookie = await login(admin)
    await setup();
    await setupCart();
})

afterEach(async () => {
    jest.restoreAllMocks();
    await cleanupCart();
    await setupCart();
})

afterAll(async () => {
    await cleanup();
})

describe("POST /carts", () => {
    test("It should return status 200", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "Realme X2" })
            .set("Cookie", customerCookie)
            .expect(200)
    })

    test("401 unauthorize, user not login", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "Realme X2" })
            .expect(401)
    })

    test("401 unauthorize, user is admin", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "Realme X2" })
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("422 empty field model", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "" })
            .set("Cookie", customerCookie)
            .expect(422)
    })

    test("409 product quantity is 0", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "Sony Ericsson V640" })
            .set("Cookie", customerCookie)
            .expect(409)
    })

    test("404 model does not exist", async () => {
        await request(app).post(`${routePath}/carts`)
            .send({ model: "none_exist" })
            .set("Cookie", customerCookie)
            .expect(404)
    })

})

describe("GET /carts", () => {
    test("It should return status 200", async () => {
        const cart = await request(app).get(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(200)
        expect(cart.body.customer).toBe(customer.username)
        expect(cart.body.products).toHaveLength(1);
    })

    test("401 unauthorize user not login", async () => {
        await request(app).get(`${routePath}/carts`)
            .expect(401)
    })

    test("401 unauthorize user is admin", async () => {
        await request(app).get(`${routePath}/carts`)
            .set("Cookie", adminCookie)
            .expect(401)
    })
})

describe("PATCH /carts", () => {
    test("It should return status 200", async () => {
        await request(app).patch(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(200)
    })

    test("401 unauthorize user not login", async () => {
        await request(app).patch(`${routePath}/carts`)
            .expect(401)
    })

    test("401 unauthorize user is admin", async () => {
        await request(app).patch(`${routePath}/carts`)
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("404 there is no unpaid card", async () => {
        // Paid for the current cart
        await request(app).patch(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(200)
        // Try to paid but there is no unpaid cart
        await request(app).patch(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(404)
    })

})

describe("GET /carts/history", () => {
    test("It should return status 200", async () => {
        const cartHistory = await request(app).get(`${routePath}/carts/history`)
            .set("Cookie", customerCookie)
            .expect(200)
        expect(cartHistory.body).toHaveLength(1);
    })

    test("401 unauthorize user not login", async () => {
        const cartHistory = await request(app).get(`${routePath}/carts/history`)
            .expect(401)
    })

    test("401 unauthorize user is admin", async () => {
        const cartHistory = await request(app).get(`${routePath}/carts/history`)
            .set("Cookie", adminCookie)
            .expect(401)
    })
})

describe("DELETE /carts/products/:model", () => {
    test("It should return status 200", async () => {
        await request(app).delete(`${routePath}/carts/products/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(200)
    })

    test("401 unauthorize user not login", async () => {
        await request(app).delete(`${routePath}/carts/products/Realme X2`)
            .expect(401)
    })

    test("401 unauthorize user is admin", async () => {
        await request(app).delete(`${routePath}/carts/products/Realme X2`)
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("404 there are no products in cart", async () => {
        // Delete product in cart
        await request(app).delete(`${routePath}/carts/products/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(200)
        // There should be no product in cart left
        await request(app).delete(`${routePath}/carts/products/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(404)
    })

    test("404 product does not exist", async () => {
        await request(app).delete(`${routePath}/carts/products/notexist`)
            .set("Cookie", customerCookie)
            .expect(404)
    })

    test("404 product is not in cart", async () => {
        // try to delete a product that is not in the cart
        await request(app).delete(`${routePath}/carts/products/Samsung R860 Caliber`)
            .set("Cookie", customerCookie)
            .expect(404)
    })
})

describe("DELETE /carts/current", () => {
    test("it should return 200", async () => {
        await request(app).delete(`${routePath}/carts/current`)
            .set("Cookie", customerCookie)
            .expect(200)
    })

    test("401 unauthorize user not login", async () => {
        await request(app).delete(`${routePath}/carts/current`)
            .expect(401)
    })

    test("401 unauthorize user is admin", async () => {
        await request(app).delete(`${routePath}/carts/current`)
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("404 there is no unpaid cart", async () => {
        //Paid for the cart
        await request(app).patch(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(200)
        //try to delete from cart but there should be no unpaid cart
        await request(app).delete(`${routePath}/carts/current`)
            .set("Cookie", customerCookie)
            .expect(404)
    })
})

describe("DELETE /carts", () => {
    test("it should return 200", async () => {
        await request(app).delete(`${routePath}/carts`)
            .set("Cookie", adminCookie)
            .expect(200)
    })

    test("401 unauthorize user not login", async () => {
        await request(app).delete(`${routePath}/carts`)
            .expect(401)
    })

    test("401 unauthorize user is customer", async () => {
        await request(app).delete(`${routePath}/carts`)
            .set("Cookie", customerCookie)
            .expect(401)
    })
})

describe("GET /carts/all", () => {
    test("It should return status 200", async () => {
        const allCart = await request(app).get(`${routePath}/carts/all`)
            .set("Cookie", adminCookie)
            .expect(200)
        expect(allCart.body).toHaveLength(2);
    })

    test("401 unauthorize user not login", async () => {
        const allCart = await request(app).get(`${routePath}/carts/all`)
            .expect(401)
    })

    test("401 unauthorize user is customer", async () => {
        const allCart = await request(app).get(`${routePath}/carts/all`)
            .set("Cookie", customerCookie)
            .expect(401)
    })
})


