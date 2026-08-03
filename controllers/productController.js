const asyncHandler = require("../utils/asyncHandler");
const {
    createProductService
} = require("../services/productService");

const createProduct = asyncHandler(async(req, res) => {
    const product =  await createProductService(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });

});

module.exports = {
    createProduct
};