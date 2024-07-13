import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO";
import { User, Role } from "../../src/components/user";
import { beforeAll, test, describe, afterAll, afterEach, expect, jest } from "@jest/globals";
import { cleanup } from "../../src/db/cleanup";
import db from "../../src/db/db";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError } from "../../src/errors/productError";

jest.setTimeout(500000)

async function setup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO products VALUES ('Realme X2', 'Laptop', 4, 57,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Samsung R860 Caliber', 'Laptop', 5, 74,'2024-05-01','')");
            db.run("INSERT INTO products VALUES ('Tecno Pova', 'Smartphone', 3, 15,'2024-05-01','')");
            db.run("INSERT INTO users (username, name, surname, role) VALUES ('customer', 'customer', 'customer', 'Customer')");
            db.run("INSERT INTO users (username, name, surname, role) VALUES ('admin', 'admin', 'admin', 'Admin')");
            db.run("INSERT INTO carts VALUES (1, 'customer', 1, null, 867)");
            db.run("INSERT INTO cartProducts VALUES (1, 'Realme X2', 'Laptop', 4, 57)");
            db.run("INSERT INTO cartProducts VALUES (1, 'Samsung R860 Caliber', 'Laptop', 5, 74)", (err) => {
                if (err) reject(err)
                else resolve()
            });
        });
    })
}

beforeAll(async () => {
    await cleanup();
    await setup();
})

afterEach(() => {
    jest.restoreAllMocks();
})

afterAll(async () => {
    await cleanup()
})

const reviewController = new ReviewController;
const customer = new User('customer', 'customer', 'customer', Role.CUSTOMER, '', '');
const admin = new User('admin', 'admin', 'admin', Role.ADMIN, '', '');

describe("Test addReview", () => {
    test("", async () => {
        const addReview = jest.spyOn(ReviewDAO.prototype, "addReview");
        try {
            await reviewController.addReview('Realme X2', customer, 1, 'good');
        } catch (error) {
            expect(error).toBeFalsy();
        }

        expect(addReview).toBeCalledTimes(1);
        expect(addReview).toBeCalledWith('Realme X2', customer, 1, 'good');
    })

    test("It should return 404 model does not exist", async () => {
        try {
            await reviewController.addReview('x2', customer, 1, 'good');
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError);
        }
    })

    test("It should return 409 there is an existing review for the product", async () => {
        try {
            await reviewController.addReview('Realme X2', customer, 1, 'good');
        } catch (error) {
            expect(error).toBeInstanceOf(ExistingReviewError);
        }
    })
})

describe("Test getProductReviews", () => {
    test("It should return an array of length 1", async () => {
        const reviews = await reviewController.getProductReviews("Realme X2")
        expect(reviews).toHaveLength(1)
    })
})

describe("Test deleteReview", () => {
    test("There should be no review left for Realme X2", async () => {
        await reviewController.deleteReview("Realme X2", customer)
        const reviews = await reviewController.getProductReviews("Realme X2")
        expect(reviews).toHaveLength(0)
    })

    test("It should return 404 ProductNotFound", async () => {
        try {
            await reviewController.deleteReview("x2", customer)
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError)
        }
    })

    test("It should return 404 NoReviewProductError", async () => {
        try {
            await reviewController.deleteReview("Tecno Pova", customer)
        } catch (error) {
            expect(error).toBeInstanceOf(NoReviewProductError)
        }
    })
})

describe("Test deleteReviewsOfProduct", () => {
    test("There should be no review left for Realme X2", async () => {
        await reviewController.addReview("Realme X2", customer, 2, "good")
        await reviewController.deleteReviewsOfProduct("Realme X2")
        const reviews = await reviewController.getProductReviews("Realme X2")
        expect(reviews).toHaveLength(0)
    })

    test("It should return 404 ProductNotFound", async () => {
        try {
            await reviewController.deleteReviewsOfProduct("x2")
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError)
        }
    })
})

describe("Test deleteAllReviews", () => {
    test("There should be no review left", async () => {
        await reviewController.addReview("Realme X2", customer, 2, "good")
        await reviewController.addReview("Samsung R860 Caliber", customer, 1, "good")
        await reviewController.deleteAllReviews()
        const review1 = await reviewController.getProductReviews("Realme X2")
        const review2 = await reviewController.getProductReviews("Samsung R860 Caliber")
        expect(review1).toHaveLength(0)
        expect(review2).toHaveLength(0)
    })
})


