import db from "../db/db"
import { User } from "../components/user"
import { ProductReview } from "../components/review"
import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";
import ProductDAO from "./productDAO";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {
    private productDao: ProductDAO

    constructor() {
        this.productDao = new ProductDAO
    }
    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string): Promise<void> {
        const product = await this.productDao.getProduct(model) /*Check for 404 product not found error*/ 
        const reviews = await this.getProductReviews(model)
        if (reviews.some(review => review.user === user.username)) throw(new ExistingReviewError)
        return new Promise((resolve, reject) => {
            try{
                const today = new Date()
                const dateString = today.toISOString().split('T')[0]
                const sql = "INSERT INTO reviews(model, user, score, date,comment) VALUES(?, ?, ?, ?, ?)"
                db.run(sql, [model, user.username, score, dateString, comment], (err: Error | null) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })

            }catch(error){
                reject(error)
            }
        })
     }

     /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string) :Promise<ProductReview[]> {
            return new Promise((resolve,reject) =>{
                try{
                    const sql = "SELECT * FROM reviews WHERE model = ?"
                    db.all(sql, [model], (err: Error | null, rows: any) => {
                        if (err) {
                            reject(err)
                        } else {
                            const reviews: ProductReview[] = rows.map(
                                (row: { model: string; user: string; score: number; date:string; comment: string; }) =>
                                    new ProductReview(row.model, row.user, row.score,row.date, row.comment))
                            resolve(reviews)
                        }
                    })
                }catch(error){
                    reject(error)
                }
            })
     }
     /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User): Promise<void>{
        const product = await this.productDao.getProduct(model) /*Check for 404 product not found error*/ 
        const reviews = await this.getProductReviews(model)
        if (reviews.every(review => review.user !== user.username)) throw (new NoReviewProductError)
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM reviews WHERE model=? AND user=?"
                db.run(sql, [model, user.username], function(err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            } catch (error) {
                reject(error)
            }
        })

     }
     /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string): Promise<void>{
        const product = await this.productDao.getProduct(model)
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM reviews WHERE model=? "
                db.run(sql, [model], function(err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() :Promise<void>{
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM reviews "
                db.run(sql, function(err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
     }

}

export default ReviewDAO;