import { test, expect, jest, afterEach } from "@jest/globals"
import ReviewController from "../../src/controllers/reviewController"
import ReviewDAO from "../../src/dao/reviewDAO"
import { describe } from "node:test";
import { ProductReview } from "../../src/components/review";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { Role, User } from "../../src/components/user"

jest.mock("../../src/dao/reviewDAO")

const controller = new ReviewController();

afterEach(() => {
    jest.restoreAllMocks()
})

test("addReview", async () => {
    const templateUser = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
    const templateReview = new ProductReview("cellphone", "test", 10, "19/12/2023", "good");
    jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce();
    const response = await controller.addReview("cellphone",templateUser,10,"good");
    expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
    expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("cellphone",templateUser,10,"good");
});

test("getProductReviews", async () => {
    const templateUser = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
    const templateReview1 = new ProductReview("cellphone", "test", 10, "19/12/2023", "good");
    const templateReview2 = new ProductReview("cellphone", "test2", 10, "19/12/2023", "good");
    const reviewArray = [templateReview1,templateReview2]
    jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce(reviewArray);
    const response = await controller.getProductReviews("cellphone");
    expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);
    expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledWith("cellphone");
    expect(response).toBe(reviewArray)
})

test("deleteReview", async () => {
    const templateUser = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
    const templateReview = new ProductReview("cellphone", "test", 10, "19/12/2023", "good");
    jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValueOnce();
    const response = await controller.deleteReview("cellphone",templateUser);
    expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);
    expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledWith("cellphone",templateUser);
})

test("deleteReviewsOfProduct success", async () => {
    const templateUser = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
    const templateReview = new ProductReview("cellphone", "test", 10, "19/12/2023", "good");
    jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();
    const response = await controller.deleteReviewsOfProduct("cellphone");
    expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
    expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith("cellphone");
})

test("deleteAllReviews success", async () => {
    const templateUser = new User("test123", "test", "test", Role.CUSTOMER, "Torino", "01/01/2000");
    const templateReview = new ProductReview("cellphone", "test", 10, "19/12/2023", "good");
    jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockResolvedValueOnce();
    const response = await controller.deleteAllReviews();
    expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
    expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledWith();
})