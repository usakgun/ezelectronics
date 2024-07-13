import db from "../db/db"
import { User } from "../components/user"
import { Cart, ProductInCart } from "../components/cart"
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../errors/cartError"
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../errors/productError"
import ProductDAO from "./productDAO"

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
    private productDao: ProductDAO

    constructor() {
        this.productDao = new ProductDAO
    }
    
    private mapToCarts(carts: any, products: any): Cart[] {
        let cartList: Cart[] = []
        for (const cart of carts) {
            cartList.push(this.mapToCart(cart, products.filter((p: any) => p.cartID == cart.cartID)))
        }
        return cartList
    }

    private mapToCart(cart: any, products: any): Cart {
        return new Cart(cart.customer, cart.paid, cart.paymentDate, cart.total, this.mapToProducts(products))
    }

    private mapToProducts(products: any): ProductInCart[] {
        return products.map((product: any) =>
            new ProductInCart(product.model, product.quantity, product.category, product.price))
    }

    /**
     * Cart creation could be changed:
     * -Query to create cart (needed for sure)
     * -Query to get cartID (maybe avoidable with other methods)
     * -Query to get cart products (avoidable for sure cart is new so empty)
     * -Query to add the product (needed for sure)
     * This reuses code but runs more queries, alternative would be more code for the case but less queries.
     */
    /**
     * 
     * @param user - The user to whom the product should be added.
     * @param product - The model of the product to add.
     * @returns A Promise that resolves to `true` of the product was successfully added.
     */
    async addToCart(user: User, product: string): Promise<Boolean> {
        function continueFunction(sql:any,cart:any,prod:any,reject:any,resolve:any) {
            sql = 'SELECT * FROM cartProducts WHERE cartID=? AND model=?'
            db.get(sql, [cart.cartID, product], (err, cartProduct: any) => {
                if (err) {
                    reject(err)
                    return
                }
                let params
                if (!cartProduct) {
                    sql = 'INSERT INTO cartProducts VALUES(?,?,?,1,?)'
                    params = [cart.cartID, prod.model, prod.category, prod.sellingPrice]
                }
                else {
                    sql = 'UPDATE cartProducts SET quantity=quantity+1 WHERE cartID=? AND model=?'
                    params = [cart.cartID, product]
                }
                db.run(sql, params, (err) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    sql = 'UPDATE carts SET total=total+? WHERE cartID=?'
                    db.run(sql, [prod.sellingPrice, cart.cartID], (err) => {
                        if (err) {
                            reject(err)
                        } else resolve(true)
                    })
                })
            })
        }
        return new Promise((resolve, reject) => {
            try {
                let sql = 'SELECT * FROM products WHERE model=?'
                db.get(sql, [product], (err, prod: any) => {
                    if (err) reject(err)  
                    if (!prod) {
                        reject(new ProductNotFoundError)
                        return
                    }
                    if (prod.quantity == 0) {
                        reject(new EmptyProductStockError)
                        return
                    }
                    sql = 'SELECT * FROM carts WHERE paid=0 AND customer=?'
                    db.get(sql, [user.username], (err, cart: any) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (!cart) {
                            sql = 'INSERT INTO carts(customer,paid,paymentDate,total) VALUES(?,0,null,0)'
                            db.run(sql, [user.username], (err) => {
                                if (err) {
                                    reject(err)
                                    return
                                }
                                sql = 'SELECT * FROM carts WHERE paid=0 AND customer=?'
                                db.get(sql, [user.username], (err, secondCart: any) => {
                                    if (err) {
                                        reject(err)
                                        return
                                    } else {
                                        cart = secondCart
                                        continueFunction(sql,cart,prod,reject,resolve)
                                    }
                                })
                            })
                        } else {
                            continueFunction(sql,cart,prod,reject,resolve)
                        }
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promis that resolves to the user's cart or an empty one if there is no current cart.
     */
    getCart(user: User): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            try {
                let sql = 'SELECT * FROM carts WHERE customer=? AND paid=0'
                db.get(sql, [user.username], (err, cart: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!cart) {
                        resolve(new Cart(user.username, false, null, 0, []))
                        return
                    }
                    sql = 'SELECT * FROM cartProducts WHERE cartID=?'
                    db.all(sql, [cart.cartID], (err, products) => {
                        if (err) {
                            reject(err)
                        } else resolve(this.mapToCart(cart, products))
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    //              ---MISSING PRODUCT STOCK UPDATE IF NEEDED HERE---
    //              ---MISSING CURRENT DATE VALUE FOR PAYMENT DATE---
    /**
     * Checks out the user's cart. We assume that the payment is always successful.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     */
    checkoutCart(user: User): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                //current cart presence check and empty cart check
                let sql = 'SELECT * FROM carts WHERE paid=0 AND customer=?'
                db.get(sql, [user.username], (err, cart:any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!cart) {
                        reject( new CartNotFoundError)
                        return
                    }
                    sql = 'SELECT * FROM cartProducts WHERE cartID=?'
                    db.all(sql,[cart.cartID],(err, products:any) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (!products || products.length==0) {
                            reject(new EmptyCartError)
                            return
                        }
                        sql = 'SELECT * FROM products WHERE model IN ('
                        products.forEach((p:any)=>{sql=sql+'\"'+p.model+'\",'})
                        sql=sql.substring(0,sql.length-1)+')'
                        db.all(sql,(err,stockProducts:any)=>{
                            if (err) {
                                reject(err)
                                return
                            }
                            for (const prod of stockProducts) {
                                if (prod.quantity==0) {
                                    reject(new EmptyProductStockError)
                                    return
                                }
                                if (prod.quantity<products.find((p:any)=>p.model==prod.model).quantity) {
                                    reject(new LowProductStockError)
                                    return
                                }
                            }
                            sql = 'UPDATE carts SET paid=1, paymentDate=? WHERE customer=? AND paid=0'
                            db.run(sql, [new Date().toISOString().split('T')[0], user.username], (err) => {
                                if (err) {
                                    reject(err)
                                } else resolve(true)
                            })
                        })

                        //UPDATE PLACEHOLDER
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     */
    getCustomerCarts(user: User): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                let sql = 'SELECT * FROM carts WHERE customer=? AND paid=1'
                db.all(sql, [user.username], (err, carts: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    sql = 'SELECT * FROM cartProducts'
                    db.all(sql, (err, products) => {
                        if (err) {
                            reject(err)
                        } else resolve(this.mapToCarts(carts, products))
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Removes one product unit from the current cart. In case of multiple units in the cart, decreases the quantity.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    removeProductFromCart(user: User, product: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
                let sql='SELECT * FROM products WHERE model=?'
                db.get(sql,[product],(err,stockProduct)=>{
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!stockProduct) {
                        reject(new ProductNotFoundError)
                        return
                    }
                })
                sql = 'SELECT * FROM carts WHERE paid=0 AND customer=?'
                db.get(sql, [user.username], (err, cart: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!cart) {
                        reject(new CartNotFoundError)
                        return
                    }
                    sql = 'SELECT * FROM cartProducts WHERE cartID=?'
                    db.all(sql, [cart.cartID], (err, cartProducts: any) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (!cartProducts || cartProducts.length==0) {
                            reject(new ProductNotInCartError)
                            return
                        }
                        let cartProduct=cartProducts.find((p:any)=>p.model==product)
                        if (!cartProduct) {
                            reject(new ProductNotInCartError)
                            return
                        }
                        if (cartProduct.quantity == 1) sql = 'DELETE FROM cartProducts WHERE cartID=? AND model=?'
                        else sql = 'UPDATE cartProducts SET quantity=quantity-1 WHERE cartID=? AND model=?'
                        db.run(sql, [cart.cartID, product], (err) => {
                            if (err) {
                                reject(err)
                                return
                            }
                            sql = 'UPDATE carts SET total=total-? WHERE cartID=?'
                            db.run(sql, [cartProduct.price, cart.cartID], (err) => {
                                if (err) {
                                    reject(err)
                                } else resolve(true)
                            })
                        })
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    clearCart(user: User): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
                let sql = 'SELECT * FROM carts WHERE customer=? AND paid=0'
                db.get(sql, [user.username], (err, cart: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!cart) {
                        reject(new CartNotFoundError)
                        return
                    }
                    sql = 'DELETE FROM cartProducts WHERE cartID=?'
                    db.run(sql, [cart.cartID], (err) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        sql = 'UPDATE carts SET total=0 WHERE cartID=?'
                        db.run(sql, [cart.cartID], (err) => {
                            if (err) {
                                reject(err)
                            } else resolve(true)
                        })
                    })
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    deleteAllCarts(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                let sql = 'DELETE FROM carts'
                db.run(sql, (err: Error | null) => {
                    if (err) {
                        reject(err)
                    } else resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Returns all carts of all users, both current and past.
     * @returns A promise that resolves to an array containing all carts.
     */
    getAllCarts(): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                let sql = 'SELECT * FROM carts'
                db.all(sql, (err: Error | null, carts: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    sql = 'SELECT * FROM cartProducts'
                    db.all(sql, (err, products) => {
                        if (err) {
                            reject(err)
                        } else resolve(this.mapToCarts(carts, products))
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default CartDAO