import { test, expect, jest, afterEach } from "@jest/globals"
import { app } from "../../index"
import CartController from "../../src/controllers/cartController"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user"
import { Cart, ProductInCart } from "../../src/components/cart"
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../../src/errors/cartError"

const controller = new CartController();

afterEach(()=>{
    jest.restoreAllMocks()
})

test("addToCart", async () => {
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
    const response = await controller.addToCart(templateUser, "cellphone");
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(templateUser, "cellphone");
    expect(response).toBe(true);
});

test("getCart", async ()=>{
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    const mockCart:Cart = new Cart("test",true,"19/12/2023",1,[])
    jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(mockCart);
    const response=await controller.getCart(templateUser);
    expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(templateUser);
    expect(response).toBe(mockCart)
})

test("checkoutCart", async ()=>{
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
    const mockCart:Cart = new Cart("test",true,"19/12/2023",1,[])
    const response=await controller.checkoutCart(templateUser);
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(templateUser);
    expect(response).toBe(true);
})

test("getCustomerCarts", async ()=>{
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    const mockCart1:Cart = new Cart("test",true,"19/12/2023",1,[])
    const mockCart2:Cart = new Cart("test2",true,"19/12/2023",1,[])
    const cartArray = [mockCart1,mockCart2]
    jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce(cartArray);
    const response=await controller.getCustomerCarts(templateUser);
    expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(templateUser);
    expect(response).toBe(cartArray)
})

test("removeProductFromCart", async ()=>{
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    //const mockCart:Cart = new Cart("test",true,"19/12/2023",1,[])
    jest.spyOn(CartDAO.prototype,"removeProductFromCart").mockResolvedValueOnce(true)
    const response=await controller.removeProductFromCart(templateUser,"cellphone");
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(templateUser,"cellphone");
    expect(response).toEqual(true);
})

test("clearCart", async ()=>{
    const templateUser = new User("test123","test","test",Role.CUSTOMER,"Torino","01/01/2000");
    jest.spyOn(CartDAO.prototype,"clearCart").mockResolvedValueOnce(true)
    const response=await controller.clearCart(templateUser);
    expect(CartDAO.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(templateUser)
    expect(response).toBe(true);
})

test("deleteAllCarts", async ()=>{
    jest.spyOn(CartDAO.prototype,"deleteAllCarts").mockResolvedValueOnce(true)
    const response=await controller.deleteAllCarts();
    expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    expect(response).toEqual(true);
})

test("getAllCarts", async ()=>{
    const mockCart1:Cart = new Cart("test",true,"19/12/2023",1,[])
    const mockCart2:Cart = new Cart("test2",true,"19/12/2023",1,[])
    const cartArray = [mockCart1,mockCart2]
    jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce(cartArray);
    const response=await controller.getAllCarts();
    expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledWith();
    expect(response).toBe(cartArray)
})