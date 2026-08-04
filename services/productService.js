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
        throw new Error("Product not found");
    }

    return product;
}

const updateProductService = async (id, productData) => {

    // Validate if product exists
    const product = await findProductById(id);

    if(!product){
        throw new Error("Product not found");
    }

    // Validate if product with same SKU exists
    const existingSku = await findProductBySku(productData.sku);

    if(existingSku && existingSku.id !== Number(id)) {
        throw new Error("Product with this SKU already exists");
    }

    // Validate if category exists
    const category = await findCategoryById(productData.category_id);

    if(!category){
        throw new Error("Category not found");
    }

    // Validate if supplier exists
    const supplier = await findSupplierById(productData.supplier_id);

    if(!supplier){
        throw new Error("Supplier not found");
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
        throw new Error("Product not found");
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