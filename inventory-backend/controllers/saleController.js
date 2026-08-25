const asyncHandler = require("../utils/asyncHandler");

const {
    createSaleService,
    getAllSalesService,
    getSaleByIdService,
    getTopSellingProductsService
} = require("../services/saleService");

const createSale = asyncHandler(async (req, res) => {
    const sale = await createSaleService(req.body, req.user.id);

    res.status(201).json({
        success: true,
        message: "Sale created successfully",
        data: sale
    })
});

const getAllSales = asyncHandler(async (req, res) => {
    const sales = await getAllSalesService();

    res.status(200).json({
        success: true,
        count: sales.length,
        data: sales
    });
});

const getSaleById = asyncHandler(async (req, res) => {
    const sale = await getSaleByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: sale
    });
});

const getTopSellingProducts = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const products = await getTopSellingProductsService(limit || 5);

    res.status(200).json({
        success: true,
        data: products,
    });
});

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    getTopSellingProducts
};