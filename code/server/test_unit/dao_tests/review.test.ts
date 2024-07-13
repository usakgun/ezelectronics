import { describe, test, expect, afterEach, jest } from "@jest/globals"
import controller from "../../src/controllers/reviewController"
import dao from "../../src/dao/reviewDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database, ERROR } from "sqlite3"
import { ProductReview} from "../../src/components/review";
import { ExistingReviewError,NoReviewProductError } from "../../src/errors/reviewError"
import ReviewDAO from "../../src/dao/reviewDAO"
import { Role, User } from "../../src/components/user";
import ProductDAO from "../../src/dao/productDAO"
import { Product, Category } from "../../src/components/product"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")
jest.mock("../../src/dao/productDAO")

const reviewDAO = new ReviewDAO()

afterEach(() => {
    jest.clearAllMocks();
});

describe("ReviewDAO", () => {
    test("addReview", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const product = new Product(3, 'model', Category.APPLIANCE, '', '', 3);
        const score = 4;
        const comment = "A great product!";
        
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as any;
        });

        const mockProductDAO = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(product)
        const mockGetProductReviews = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([])
        
        await expect(reviewDAO.addReview(product.model, user, score, comment)).resolves.toBeUndefined();
    });

    test("getProductReviews", async () => {
        const model = "productModel";
        const mockReviews: ProductReview[] = [
            new ProductReview(model, "testuser1", 4, "28/05/2024", "Great product"),
            new ProductReview(model, "testuser2", 5, "29/05/2024", "Excellent!")
        ];
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [
                { model, user: "testuser1", score: 4, date: "28/05/2024", comment: "Great product" },
                { model, user: "testuser2", score: 5, date: "29/05/2024", comment: "Excellent!" }
            ]);
            return {} as any;
        });

        await expect(reviewDAO.getProductReviews(model)).resolves.toEqual(mockReviews);
    });

    test("deleteReview", async () => {
        const product = new Product(3, 'model', Category.APPLIANCE, '', '', 3);
        const user = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
        const review = new ProductReview(product.model, user.username, 2, '', '');
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as any;
        });

        const mockProductDAO = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(product)
        const mockGetProductReviews = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([review])

        await expect(reviewDAO.deleteReview(product.model, user)).resolves.toBeUndefined();
    });

    test("deleteReviewsOfProduct", async () => {
        const product = new Product(3, 'model', Category.APPLIANCE, '', '', 3);
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as any;
        });

        const mockProductDAO = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(product)

        await expect(reviewDAO.deleteReviewsOfProduct(product.model)).resolves.toBeUndefined();
    });

    test("deleteAllReviews", async () => {
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as any;
        });

        await expect(reviewDAO.deleteAllReviews()).rejects.toBeDefined();
    });
});