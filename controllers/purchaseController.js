const asyncHandler = require("../utils/asyncHandler");

const {createPurchaseService} = require("../services/purchaseService");

const createPurchase = asyncHandler(async(req, res) => {
    const purchase =  await createPurchaseService(req.body, req.user.id);

    res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        data: purchase
    });
});


module.exports = {createPurchase,};