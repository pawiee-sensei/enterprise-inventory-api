const {
    findAllProducts,
    findProductById,
    findProductBySku,
    createProduct,
    findCategoryById,
    findSupplierById
} = require('../models/productModel');

const createProductService = async (productData) => {
    const existingProduct = await findProductBySku(productData.sku);

    if(existingProduct){
        throw new Error("Product with this SKU already exists");
    };

    const category = await findCategoryById(productData.category_id);

    if(!category){
        throw new Error("Category not found");
    };

    const supplier = await findSupplierById(productData.supplier_id);

    if(!supplier){
        throw new Error("Supplier not found");
    };

    if(productData.cost_price < 0){
        throw new Error("Cost price cannot be negative");
    }

    if(productData.selling_price < 0){
        throw new Error("Selling price cannot be negative");
    }

    if(productData.stock < 0){
        throw new Error("Stock cannot be negative");
    }

    if(productData.minimum_stock < 0){
        throw new Error("Minimum stock cannot be negative");
    }

    const productId = await createProduct(productData);

    return{
        id: productId,
        sku: productData.sku,
        name: productData.name,
    };
};

const getAllProductsService = async () => {
    const products = await findAllProducts();

    return products;
};

module.exports = {
    createProductService,
    getAllProductsService
};