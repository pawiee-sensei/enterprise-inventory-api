const asyncHandler = require("../utils/asyncHandler");

const {
    createSaleReturnService
} = require("../services/saleReturnService");

const createSaleReturn = asyncHandler(async(req, res) => {
    const saleReturn = await createSaleReturnService(
        req.params.id,
        req.body,
        req.user.id
    );

    res.status(201).json({
        success: true,
        data: saleReturn
    });
});

module.exports = {
    createSaleReturn
};