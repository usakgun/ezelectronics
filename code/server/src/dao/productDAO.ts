import db from "../db/db"
import { ProductAlreadyExistsError, ProductNotFoundError } from "../errors/productError"
import { Category, Product } from "../components/product"


/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {

    /**
     * Register new arrival model
     * @param model 
     * @param category 
     * @param quantity 
     * @param details 
     * @param sellingPrice 
     * @param arrivalDate 
     * @returns A promise resolve to number of row changed, if run correctly should be 1
     */
    registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "INSERT INTO products(model, category, quantity, sellingPrice, arrivalDate, details) VALUES (?, ?, ?, ?, ?, ?)"
                db.run(sql, [model, category, quantity, sellingPrice, arrivalDate, details], function (err: Error | null) {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError())
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Get all products
     * @returns Promise resolve to and array of products
     */
    getAllProducts(): Promise<Product[]>{
        return new Promise<Product[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products"
                db.all(sql, [], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        const products: Product[] = rows.map(
                            (row: { sellingPrice: number; model: string; category: Category; arrivalDate: string; details: string; quantity: number }) =>
                                new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                        resolve(products)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Get all products in a category
     * @param category 
     * @returns Promise resolve to an array of products
     */
    getProductsByCategory(category: string): Promise<Product[]>{
        return new Promise<Product[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE category=?"
                db.all(sql, [category], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        const products: Product[] = rows.map(
                            (row: { sellingPrice: number; model: string; category: Category; arrivalDate: string; details: string; quantity: number }) =>
                                new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                        resolve(products)
                    }
                })
            } catch(err) {
                resolve(err)
            }
        })
    }

    /**
     * Get product by model
     * @param model 
     * @returns Promise resolve to the product by model
     */
    getProduct(model: string): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model=?"
                db.get(sql, [model], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err)
                    } else if (!row) {
                        reject(new ProductNotFoundError())
                    } else {
                        const product: Product = new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity)
                        resolve(product)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Change quantity of a model
     * @param model 
     * @param quantity 
     * @returns Promise resolve to true, if run correctly
     */
    changeProductQuantity(model: string, quantity: number): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "UPDATE products SET quantity=? WHERE model=?"
                db.run(sql, [quantity, model], function (err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Delete all products from database
     * @returns Promise resolve to true if successfully delete
     */
    deleteAllProducts(): Promise<Boolean>{
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products"
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Delete a specific model
     * @param model 
     * @returns Promise resolve to true if successfully delete
     */
    deleteProduct(model: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products WHERE model=?"
                db.run(sql, [model], function (err: Error | null) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default ProductDAO