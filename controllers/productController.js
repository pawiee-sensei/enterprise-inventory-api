const asyncHandler = require("../utils/asyncHandler");
const {
    createProductService,
    getAllProductsService
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
})

module.exports = {
    createProduct,
    getAllProducts
};