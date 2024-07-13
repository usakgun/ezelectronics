import { test, expect, jest, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import Authenticator from "../../src/routers/auth"
const baseURL = "/ezelectronics/reviews"
import { ProductReview} from "../../src/components/review";
import controller from "../../src/controllers/reviewController"

jest.mock("../../src/routers/auth");

test("It should return a 200 success code", async () => {
    const testReview = {
        score: 5,
        comment: "Good",
    };
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
    jest.spyOn(controller.prototype, "addReview").mockResolvedValueOnce();
    const response = await request(app).post(baseURL+'/test').send(testReview);
    expect(response.status).toBe(200);
    expect(controller.prototype.addReview).toHaveBeenCalledTimes(1);
});

describe("GET", () => {
    test("getProductReviews", async () => {
        const resolvedVal = [] as ProductReview[]
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "getProductReviews").mockResolvedValueOnce(resolvedVal);
        const response = await request(app).get(baseURL+'/productModel').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.getProductReviews).toBeCalledTimes(1);
    });
});

describe("DELETE", () => {
    test("deleteReview", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "deleteReview").mockResolvedValueOnce();
        const response = await request(app).delete(baseURL+'/productModel').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.deleteReview).toBeCalledTimes(1);
    });
});

describe("DELETE", () => {
    test("deleteReviewsOfProduct", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();
        const response = await request(app).delete(baseURL+'/productModel/all').send();
        expect(response.status).toBe(200);
        expect(controller.prototype.deleteReviewsOfProduct).toBeCalledTimes(1);
    });
});

describe("DELETE", () => {
    test("deleteAllReviews", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(controller.prototype, "deleteAllReviews").mockResolvedValueOnce();
        const response = await request(app).delete(baseURL).send();
        expect(response.status).toBe(200);
        expect(controller.prototype.deleteAllReviews).toBeCalledTimes(1);
    });
});