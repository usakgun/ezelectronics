import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals"
import { cleanup } from "../../src/db/cleanup"
import db from "../../src/db/db"
import CartController from "../../src/controllers/cartController"
import { User, Role } from "../../src/components/user"
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError"
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError"

jest.setTimeout(500000)

async function setup() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT INTO users (username, name, surname, role) VALUES ('customer', 'customer', 'customer', 'Customer')");
            db.run("INSERT INTO users (username, name, surname, role) VALUES ('admin', 'admin', 'admin', 'Admin')");
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

const cartController = new CartController()
const customer = new User('customer', 'customer', 'customer', Role.CUSTOMER, '', '');
const admin = new User('admin', 'admin', 'admin', Role.ADMIN, '', '');

beforeAll(async () => {
    await cleanup();
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

describe("addToCart", () => {
    test("It should return true", async () => {
        const result = await cartController.addToCart(customer, 'Realme X2')
        expect(result).toBe(true)
    })

    test("product quantity is 0 emptyProductStockError", async () => {
        try {
            const result = await cartController.addToCart(customer, 'Sony Ericsson V640')
        } catch (error) {
            expect(error).toBeInstanceOf(EmptyProductStockError)
        }
    })

    test("false model does not exist", async () => {
        try {
            const result = await cartController.addToCart(customer, 'notexist')
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError)
        }
    })

})

describe("getCart", () => {
    test("It should return status unpaid cart of customer", async () => {
        const cart = await cartController.getCart(customer)
        expect(cart.customer).toBe(customer.username)
        expect(cart.paid).toBeFalsy()
    })
})

describe("checkoutCart", () => {
    test("It should return true", async () => {
        const result = await cartController.checkoutCart(customer)
        expect(result).toBe(true)
    })

    test("false there is no unpaid card", async () => {
        // Paid for the current cart
        const result = await cartController.checkoutCart(customer)
        expect(result).toBe(true)
        // Try to paid but there is no unpaid cart
        try {
            const result2 = await cartController.checkoutCart(customer)
        } catch (error) {
            expect(error).toBeInstanceOf(CartNotFoundError)
        }
        
    })

    test("card contain no product", async () => {
        // remove product from cart
        const result = await cartController.removeProductFromCart(customer, 'Realme X2')
        expect(result).toBe(true)
        // Try to paid but there is no product in cart
        try {
            const result2 = await cartController.checkoutCart(customer)
        } catch (error) {
            expect(error).toBeInstanceOf(EmptyCartError)
        }

    })
})

describe("getCustomerCarts", () => {
    test("It should return paid carts of customemr", async () => {
        const carts = await cartController.getCustomerCarts(customer)
        expect(carts).toHaveLength(1)
        expect(carts[0].customer).toBe(customer.surname)
    })
})

describe("removeProductFromCart", () => {
    test("It should return true", async () => {
        const result = await cartController.removeProductFromCart(customer, 'Realme X2')
        expect(result).toBe(true)
    })

    test("false there are no products in cart", async () => {
        // Delete product in cart
        const result = await cartController.removeProductFromCart(customer, 'Realme X2')
        expect(result).toBe(true)
        // There should be no product in cart left
        try {
            const result2 = await cartController.removeProductFromCart(customer, 'Realme X2')
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotInCartError)
        }
    })

    test("false there are no unpaid cart", async () => {
        // Delete product in cart
        const result = await cartController.checkoutCart(customer)
        expect(result).toBe(true)
        // There should be no unpaid cart left
        try {
            const result2 = await cartController.removeProductFromCart(customer, 'Realme X2')
        } catch (error) {
            expect(error).toBeInstanceOf(CartNotFoundError)
        }
    })

    test("false product does not exist", async () => {
        try{
        const result = await cartController.removeProductFromCart(customer, 'notexist')
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError)
        }
    })

    test("false product is not in cart", async () => {
        // try to delete a product that is not in the cart
        try {
            const result = await cartController.removeProductFromCart(customer, 'Samsung R860 Caliber')
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotInCartError)
        }
    })
})

describe("clearCart", () => {
    test("it should return true", async () => {
        const result = await cartController.clearCart(customer)
        expect(result).toBe(true)
    })

    test("false there is no unpaid cart", async () => {
        //Paid for the cart
        const result = await cartController.checkoutCart(customer)
        expect(result).toBe(true)
        //try to delete from cart but there should be no unpaid cart
        try {
            const result2 = await cartController.clearCart(customer)
        } catch (error) {
            expect(error).toBeInstanceOf(CartNotFoundError)
        }
    })
})

describe("deleteAllCarts", () => {
    test("it should return true", async () => {
        const result = await cartController.deleteAllCarts()
        expect(result).toBe(true)
    })
})

describe("getAllCarts", () => {
    test("It should return all carts", async () => {
        const carts = await cartController.getAllCarts()
        expect(carts).toBeDefined()
        expect(carts).toHaveLength(2)
    })
})