import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { cleanup } from "../../src/db/cleanup"
import db from "../../src/db/db"

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
})

afterEach(() => {
    jest.restoreAllMocks();
})

afterAll(async () => {
    await cleanup()
})

describe("POST /reviews/:model", () => {
    test("It should return status 200", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 1, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(200)
    })

    test("It should return 422 score > 5", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 6, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(422)
    })

    test("It should return 422 comment is empty", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 2, comment: "" })
            .set("Cookie", customerCookie)
            .expect(422)
    })

    test("401 Unauthorize admin is not user", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 2, comment: "good" })
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("404 product doesn't exist", async () => {
        await request(app).post(`${routePath}/reviews/X2`)
            .send({ score: 2, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(404)
    })

    test("409 ExistingReviewError", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 2, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(409)
    })
})

describe("GET /reviews/:model", () => {
    test("It should return an array of length 1", async() => {
        const reviews = await request(app).get(`${routePath}/reviews/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(200)
        expect(reviews.body).toHaveLength(1)
        const product = reviews.body[0].model
        expect(product).toBe("Realme X2")
    })

    test("Can only access by a loggin user", async () => {
        const reviews = await request(app).get(`${routePath}/reviews/Realme X2`)
            .expect(401)
    })
})

describe("DELETE /reviews/:model", () => {
    test("admin is not customer", async () => {
        await request(app).delete(`${routePath}/reviews/Realme X2`)
            .set("Cookie", adminCookie)
            .expect(401)
    })

    test("user not login", async () => {
        await request(app).delete(`${routePath}/reviews/Realme X2`)
            .expect(401)
    })

    test("model doesn't exist", async () => {
        await request(app).delete(`${routePath}/reviews/x2`)
            .set("Cookie", customerCookie)
            .expect(404)
    })

    test("user have never reviewed product", async () => {
        await request(app).delete(`${routePath}/reviews/Tecno Pova`)
            .set("Cookie", customerCookie)
            .expect(404)
    })

    test("There should be no review of Realme X2 left", async () => {
        await request(app).delete(`${routePath}/reviews/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(200)
        const reviews = await request(app).get(`${routePath}/reviews/Realme X2`)
            .set("Cookie", customerCookie)
            .expect(200)
        expect(reviews.body).toHaveLength(0)
    })
})

describe("DELETE /reviews/:model/all", () => {
    test("user not login", async () => {
        await request(app).delete(`${routePath}/reviews/Realme X2/all`)
            .expect(401)
    })

    test("user not admin or manager", async () => {
        await request(app).delete(`${routePath}/reviews/Realme X2/all`)
            .set("Cookie", customerCookie)
            .expect(401)
    })

    test("model doesn't exist", async () => {
        await request(app).delete(`${routePath}/reviews/x2/all`)
            .set("Cookie", adminCookie)
            .expect(404)
    })

    test("There should be no reviews left", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 1, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(200)
        await request(app).delete(`${routePath}/reviews/Realme X2/all`)
            .set("Cookie", adminCookie)
            .expect(200)
        const reviews = await request(app).get(`${routePath}/reviews/Realme X2`)
            .set("Cookie", adminCookie)
            .expect(200)
        expect(reviews.body).toHaveLength(0)
    })
})

describe("DELETE /reviews", () => {
    test("user is not login", async () => {
        await request(app).delete(`${routePath}/reviews`)
            .expect(401)
    })

    test("user is not manager or admin", async () => {
        await request(app).delete(`${routePath}/reviews`)
            .set("Cookie", customerCookie)
            .expect(401)
    })

    test("There should be no reviews left", async () => {
        await request(app).post(`${routePath}/reviews/Realme X2`)
            .send({ score: 1, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(200)
        await request(app).post(`${routePath}/reviews/Samsung R860 Caliber`)
            .send({ score: 1, comment: "good" })
            .set("Cookie", customerCookie)
            .expect(200)
        await request(app).delete(`${routePath}/reviews`)
            .set("Cookie", adminCookie)
            .expect(200)
        const reviews1 = await request(app).get(`${routePath}/reviews/Realme X2`)
            .set("Cookie", adminCookie)
            .expect(200)
        const reviews2 = await request(app).get(`${routePath}/reviews/Samsung R860 Caliber`)
            .set("Cookie", adminCookie)
            .expect(200)
        expect(reviews1.body).toHaveLength(0)
        expect(reviews2.body).toHaveLength(0)
    })
})
