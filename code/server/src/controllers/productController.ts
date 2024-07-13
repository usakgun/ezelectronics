import ProductDAO from "../dao/productDAO";
import { DateError } from "../utilities";
import { Product } from "../components/product";
import { EmptyProductStockError, LowProductStockError } from "../errors/productError";

/**
 * Represents a controller for managing products.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ProductController {
    private dao: ProductDAO

    constructor() {
        this.dao = new ProductDAO
    }

    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    async registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null): Promise<void> {
        const today = new Date()
        let arrival: Date
        if (arrivalDate.length === 0) {
            arrival = today
        } else {
            arrival = new Date(arrivalDate)
            if (today < arrival) throw new DateError()
        }
        const result = await this.dao.registerProducts(model, category, quantity, details, sellingPrice, arrival.toISOString().split('T')[0])
    }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
        const product: Product = await this.dao.getProduct(model)
        const today: Date = new Date()
        const arrival: Date = new Date(product.arrivalDate)
        let dateChange: Date
        if (!changeDate) {
            dateChange = today
        } else {
            dateChange = new Date(changeDate)
            if (today < dateChange) throw new DateError()
            if(arrival > dateChange) throw new DateError()
        }
        const totalQuantity = product.quantity + newQuantity
        const result = await this.dao.changeProductQuantity(model, totalQuantity)
        return totalQuantity
    }

    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
        const product: Product = await this.dao.getProduct(model)
        const today: Date = new Date()
        const arrivalDate: Date = new Date(product.arrivalDate)
        let dateChange: Date
        if (!sellingDate) {
            dateChange = today
        } else {
            dateChange = new Date(sellingDate)
            if (today < dateChange) throw new DateError()
            if (arrivalDate > dateChange) throw new DateError()
        }
        if (product.quantity === 0) throw new EmptyProductStockError()
        if (product.quantity < quantity) throw new LowProductStockError()
        const totalQuantity = product.quantity - quantity
        const result = await this.dao.changeProductQuantity(model, totalQuantity)
        return totalQuantity
    }

    /**
     * Returns all products in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        if (grouping === "category") {
            return this.dao.getProductsByCategory(category)
        }
        if (grouping === "model") {
            const product: Product = await this.dao.getProduct(model)
            return [product]
        }
        return this.dao.getAllProducts()
    }

    /**
     * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        if (grouping === "category") {
            const products: Product[] = await this.dao.getProductsByCategory(category)
            return products.filter(product => product.quantity > 0)
        }
        if (grouping === "model") {
            const product: Product = await this.dao.getProduct(model)
            return product.quantity > 0 ? [product] : []
        }
        const products: Product[] = await this.dao.getAllProducts()
        return products.filter(product => product.quantity > 0)
    }

    /**
     * Deletes all products.
     * @returns A Promise that resolves to `true` if all products have been successfully deleted.
     */
    async deleteAllProducts(): Promise<Boolean> {
        return this.dao.deleteAllProducts()
    }


    /**
     * Deletes one product, identified by its model
     * @param model The model of the product to delete
     * @returns A Promise that resolves to `true` if the product has been successfully deleted.
     */
    async deleteProduct(model: string): Promise<Boolean> {
        const product: Product = await this.dao.getProduct(model)
        return this.dao.deleteProduct(model)
    }

}

export default ProductController;