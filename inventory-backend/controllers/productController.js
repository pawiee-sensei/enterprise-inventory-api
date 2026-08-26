const asyncHandler = require("../utils/asyncHandler");
const {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    updateProductAvailabilityService
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

const updateProduct = asyncHandler(async(req, res) => {
    const product = await updateProductService(req.params.id, req.body);

    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
});

const deleteProduct = asyncHandler(async(req, res) => {
    await deleteProductService(req.params.id);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

const updateProductAvailability = asyncHandler(async (req, res) => {
    const { is_available_for_sale } = req.body;
    const result = await updateProductAvailabilityService(req.params.id, is_available_for_sale);

    res.status(200).json({
        success: true,
        message: "Availability updated",
        data: result,
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductAvailability
};
