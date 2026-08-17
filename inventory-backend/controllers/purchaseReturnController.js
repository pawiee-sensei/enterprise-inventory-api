const asyncHandler = require("../utils/asyncHandler");

const createPurchaseReturnService = require("../services/purchaseReturnService");

const createPurchaseReturn = asyncHandler(async(req, res) => {
    const purchaseReturn = await createPurchaseReturnService(
        req.params.id,
        req.body,
        req.user.id
    );

    res.status(201).json({
        success: true,
        data: purchaseReturn
    });
});

module.exports = {
    createPurchaseReturn
};