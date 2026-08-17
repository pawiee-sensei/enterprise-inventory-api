const {
    findAllProducts,
    findProductById,
    findProductBySku,
    createProduct,
    findCategoryById,
    findSupplierById,
    updateProduct,
    deleteProduct
} = require('../models/productModel');

const AppError = require('../utils/AppError');

const createProductService = async (productData) => {
    const existingProduct = await findProductBySku(productData.sku);

    if(existingProduct){
        throw new AppError("Product with this SKU already exists", 409);
    };

    const category = await findCategoryById(productData.category_id);

    if(!category){
        throw new AppError("Category not found", 404);
    };

    const supplier = await findSupplierById(productData.supplier_id);

    if(!supplier){
        throw new AppError("Supplier not found", 404);
    };


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

const getProductByIdService = async (id) => {
    const product = await findProductById(id);

    if(!product){
        throw new AppError("Product not found", 404);
    }

    return product;
}

const updateProductService = async (id, productData) => {

    // Validate if product exists
    const product = await findProductById(id);

    if(!product){
        throw new AppError("Product not found", 404);
    }

    // Validate if product with same SKU exists
    const existingSku = await findProductBySku(productData.sku);

    if(existingSku && existingSku.id !== Number(id)) {
        throw new AppError("Product with this SKU already exists", 409);
    }

    // Validate if category exists
    const category = await findCategoryById(productData.category_id);

    if(!category){
        throw new AppError("Category not found", 404);
    }

    // Validate if supplier exists
    const supplier = await findSupplierById(productData.supplier_id);

    if(!supplier){
        throw new AppError("Supplier not found", 404);
    }

    // Update the product
    await updateProduct(id, productData);

    return {
        id: Number(id),
        sku: productData.sku,
        name: productData.name,
    };

};

const deleteProductService = async (id) => {
    // Validate if product exists
    const product = await findProductById(id);

    if(!product){
        throw new AppError("Product not found", 404);
    }

    // Delete the product
    await deleteProduct(id);

    return;
};

module.exports = {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService
};