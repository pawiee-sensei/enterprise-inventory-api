const asyncHandler = require("../utils/asyncHandler");
const {
    createProductService,
    getAllProductsService,
    getProductByIdService
} = require("../services/productService");

const createProduct = asyncHandler(async(req, res) => {
    const product =  await createProductService(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });

});

const getAllProducts = asyncHandler(async(req, res) => {
    const products = await getAllProductsService();

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    })
});

const getProductById = asyncHandler(async(req, res) => {
    const product = await getProductByIdService(req.params.id);

    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        data: product
    })
})

module.exports = {
    createProduct,
    getAllProducts,
    getProductById
};
