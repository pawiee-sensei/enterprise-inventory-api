const asyncHandler = require("../utils/asyncHandler");

const {
    createSaleService
} = require("../services/saleService");

const createSale = asyncHandler(async (req, res) => {
    const sale = await createSaleService(req.body, req.user.id);

    res.status(201).json({
        success: true,
        message: "Sale created successfully",
        data: sale
    })
});

module.exports = {
    createSale
};