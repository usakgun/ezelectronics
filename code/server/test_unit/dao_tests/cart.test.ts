import { describe, test, expect, jest, afterEach} from "@jest/globals"
import db from "../../src/db/db"
import { Database, ERROR } from "sqlite3"
import { Cart, ProductInCart } from "../../src/components/cart"
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError  } from "../../src/errors/cartError"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import { Category } from "../../src/components/product"
jest.mock("crypto")
jest.mock("../../src/db/db.ts")

const cartDAO = new CartDAO()

afterEach(()=>{
    jest.restoreAllMocks()
})

describe("CartDAO", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("addToCart", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const product = "productModel"
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("products")) {
                callback(null, { model: "productModel", quantity: 10, sellingPrice: 100 })
            } else if (sql.includes("carts")) {
                callback(null, { cartID: 1, customer: "username", paid: 0, total: 0 })
            } else {
                callback(null, null)
            }
            return {} as any
        })
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as any
        })
        const response = await cartDAO.addToCart(user, product)
        expect(response).toBe(true)
    })

    test("getCart", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const mockCart:Cart = new Cart("test",false,"19/12/2023",100,[new ProductInCart("productModel", 1, Category.LAPTOP, 100)])
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { cartID: 1, customer: "test", paid: false,paymentDate: "19/12/2023",total: 100 })
            return {} as any
        })
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: "productModel", quantity: 1, category: Category.LAPTOP, price: 100 }])
            return {} as any
        })
        const response = await cartDAO.getCart(user)
        expect(response).toEqual(mockCart)

        mockDBGet.mockRestore();
        mockDBAll.mockRestore();
    })


    test("checkoutCart", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("carts")) {
                callback(null, { cartID: 1, customer: "username", paid: 0, total: 100 })
            } else {
                callback(null, { model: "productModel", quantity: 10 })
            }
            return {} as any
        })
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: "productModel", quantity: 1 }])
            return {} as any
        })
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as any
        })
        await expect(cartDAO.checkoutCart(user)).rejects.toBeDefined()

    })

    test("getCustomerCarts", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const mockCart:Cart = new Cart("test",true,"19/12/2023",1,[])
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (sql.includes("carts")) {
                callback(null, [{ cartID: 1, customer: "username", paid: 1, total: 100 }])
            } else {
                callback(null, [{ cartID: 1, model: "productModel", quantity: 1, category: "category", price: 100 }])
            }
            return {} as any
        })
        await expect(cartDAO.getCustomerCarts(user)).rejects.toBeDefined()
    })

    test("removeProductFromCart", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
        const product = "productModel"
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { cartID: 1, customer: "username", paid: 0, total: 100 })
            return {} as any
        })
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: "productModel", quantity: 1, price: 100 }])
            return {} as any
        })
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as any
        })
        const response = await cartDAO.removeProductFromCart(user, product)
        expect(response).toBe(true)
    })

    test("clearCart", async () => {
        const user = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");

        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { cartID: 1, customer: "username", paid: 0, total: 100 })
            return {} as any
        })
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as any
        })
        const response = await cartDAO.clearCart(user)
        expect(response).toBe(true)
    })

    test("deleteAllCarts", async () => {
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as any
        })
        await expect(cartDAO.deleteAllCarts()).rejects.toBeDefined()
    })

    test("getAllCarts", async () => {
        const mockCart:Cart = new Cart("test",true,"19/12/2023",1,[])
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (sql.includes("carts")) {
                callback(null, [{ cartID: 1, customer: "username", paid: 1, total: 100 }])
            } else {
                callback(null, [{ cartID: 1, model: "productModel", quantity: 1, category: "category", price: 100 }])
            }
            return {} as any
        })
        await expect(cartDAO.getAllCarts()).rejects.toBeDefined()
    })
})