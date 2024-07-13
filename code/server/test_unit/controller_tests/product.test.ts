import { test, expect, jest, describe, afterEach } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO"
import { Product , Category} from "../../src/components/product";
import { ProductNotFoundError, LowProductStockError, EmptyProductStockError } from "../../src/errors/productError";

jest.mock("../../src/dao/productDAO")

const controller = new ProductController();
afterEach(() => {
    jest.restoreAllMocks();
});

test("it should return true", async ()=> {
    const productTest = {
        sellingPrice: 2,
        model: "productModel",
        category: "laptop",
        arrivalDate: "2024-06-01",
        details: "productDetails",
        quantity: 30
    }
    jest.spyOn(ProductDAO.prototype, "registerProducts").mockResolvedValueOnce(true);
    const response = await controller.registerProducts(productTest.model,productTest.category, productTest.quantity, productTest.details, productTest.sellingPrice,productTest.arrivalDate);

    expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledWith(
        productTest.model,
        productTest.category,
        productTest.quantity,
        productTest.details,
        productTest.sellingPrice,
        productTest.arrivalDate );
});


//changeProductQuantity()
test("changeProductQuantity", async ()=> {
    const mockProduct = new Product(150, "model1", Category.LAPTOP, "2024-06-01", "details1", 10);
    const newQuantity = 5;
    const changeDate = "2024-06-06";
    const expectedTotalQuantity = mockProduct.quantity + newQuantity;
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct);
    const mockChangeProductQuant = jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(true);

    const controller = new ProductController();
    const response = await controller.changeProductQuantity(mockProduct.model, newQuantity, changeDate);

    expect(response).toEqual(expectedTotalQuantity);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(mockProduct.model);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(mockProduct.model, expectedTotalQuantity);

    mockGetproduct.mockRestore();
    mockChangeProductQuant.mockRestore();
});

//sellProduct()
test("sellProduct success", async () => {
    const mockProduct = new Product(100, "model1", Category.LAPTOP, "2024-06-01", "details1", 10);
    const sellQuantity = 5;
    const sellingDate = "2024-06-09";
    const expectedTotalQuantity = mockProduct.quantity - sellQuantity;
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct);
    const mockChangeProductQuantity = jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(true);

    const response = await controller.sellProduct(mockProduct.model, sellQuantity, sellingDate);

    expect(response).toEqual(expectedTotalQuantity);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(mockProduct.model);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(mockProduct.model, expectedTotalQuantity);

    mockGetproduct.mockRestore();
    mockChangeProductQuantity.mockRestore();
});
test("sellProduct throws EmptyProductStockError", async () => {
    const mockProduct = new Product(100, "model1", Category.LAPTOP, "2024-06-01", "details1", 0);
    const sellQuantity = 1;
    const sellingDate = "2024-06-09";
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct);

    const controller = new ProductController();

    await expect(controller.sellProduct(mockProduct.model, sellQuantity, sellingDate)).rejects.toThrow(EmptyProductStockError);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(mockProduct.model);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);

    mockGetproduct.mockRestore();
});

test("sellProduct throws LowProductStockError", async () => {
    const mockProduct = new Product(100, "model1", Category.LAPTOP, "2024-06-01", "details1", 2);
    const sellQuantity = 5;
    const sellingDate = "2024-06-10";
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct);

    const controller = new ProductController();

    await expect(controller.sellProduct(mockProduct.model, sellQuantity, sellingDate)).rejects.toThrow(LowProductStockError);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(mockProduct.model);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);

    mockGetproduct.mockRestore();
});

//getProduct()
test("getProduct success", async () => {
    const mockProduct = new Product(100, "model1", Category.LAPTOP, "2024-06-01", "details1", 2);
    const expectedProduct = mockProduct;
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct);

    const controller = new ProductController();
    const response = await controller.getProducts("model", null, "model1");

    expect(response).toEqual([expectedProduct]);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith("model1");

    mockGetproduct.mockRestore();
});

test("getProduct error", async () => {
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockRejectedValueOnce(new ProductNotFoundError());

    await expect(controller.getProducts("model", null, "nonexistent_model")).rejects.toThrow(ProductNotFoundError);

    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith("nonexistent_model");

    mockGetproduct.mockRestore();
});

//getAvailableProduct()
test("getAvailableProducts category success", async () => {
    const mockProduct1 = new Product(1, "model1", Category.LAPTOP, "2024-06-01", "details1", 0);
    const mockProduct3 = new Product(3, "model3", Category.LAPTOP, "2024-06-01", "details3", 5);
    const mockGetproductByCat = jest.spyOn(ProductDAO.prototype, "getProductsByCategory").mockResolvedValueOnce([mockProduct1, mockProduct3]);

    const controller = new ProductController();

    const response = await controller.getAvailableProducts("category", "LAPTOP", null);
    expect(response).toEqual([mockProduct3]);
    mockGetproductByCat.mockRestore();
});


test("getAvailableProducts model success", async () => {
    const mockProduct2 = new Product(2, "model2", Category.SMARTPHONE, "2024-06-02", "details2", 3);
    const mockGetproduct = jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(mockProduct2);

    const controller = new ProductController();

    const response = await controller.getAvailableProducts("model", null, "model2");
    expect(response).toEqual([mockProduct2]);

    mockGetproduct.mockRestore();
});

test("getAvailableProducts all success", async () => {
    const mockProduct1 = new Product(1, "model1", Category.LAPTOP, "2024-06-01", "details1", 0);
    const mockProduct2 = new Product(2, "model2", Category.SMARTPHONE, "2024-06-02", "details2", 3);
    const mockProduct3 = new Product(3, "model3", Category.LAPTOP, "2024-06-03", "details3", 5);
    const mockGetAllproduct =  jest.spyOn(ProductDAO.prototype, "getAllProducts").mockResolvedValueOnce([mockProduct1, mockProduct2, mockProduct3]);

    const controller = new ProductController();

    const response = await controller.getAvailableProducts(null, null, null);
    expect(response).toEqual([mockProduct2, mockProduct3]);

    mockGetAllproduct.mockRestore();
});


//deleteProduct()
test("deleteProduct model success", async ()=> {
    const expected: boolean=true
    const mockProduct = new Product(1, "model1", Category.LAPTOP, "2024-06-01", "details1", 1);
    const mockDeleteproduct = jest.spyOn(ProductDAO.prototype,"deleteProduct").mockResolvedValueOnce(true)
    const mockGetproduct = jest.spyOn(ProductDAO.prototype,"getProduct").mockResolvedValueOnce(mockProduct)

    const controller = new ProductController();
    const response = await controller.deleteProduct(mockProduct.model)

    expect(response).toEqual(expected)
    expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1)
    expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith("model1")
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith("model1");

    mockGetproduct.mockRestore();
    mockDeleteproduct.mockRestore();
})

test("deleteProduct category success", async ()=> {
    const expected: boolean=true
    const mockProduct = new Product(1, "model1", Category.LAPTOP, "2024-06-01", "details1", 1);
    const mockDeleteproduct = jest.spyOn(ProductDAO.prototype,"deleteProduct").mockResolvedValueOnce(true)
    const mockGetproduct = jest.spyOn(ProductDAO.prototype,"getProduct").mockResolvedValueOnce(mockProduct)

    const controller = new ProductController();
    const response = await controller.deleteProduct(mockProduct.model)

    expect(response).toEqual(expected)
    expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1)
    expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith("model1")
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith("model1");

    mockGetproduct.mockRestore();
    mockDeleteproduct.mockRestore();
})

//deleteAll()
test("deletAllProducts", async ()=>{
    const expected:boolean=true
    const mockDeleteAllProd = jest.spyOn(ProductDAO.prototype,"deleteAllProducts").mockResolvedValueOnce(true)

    const controller = new ProductController();
    const response=await controller.deleteAllProducts();

    expect(response).toEqual(expected)
    expect(ProductDAO.prototype.deleteAllProducts).toHaveBeenCalledTimes(1)

    mockDeleteAllProd.mockRestore();
})
