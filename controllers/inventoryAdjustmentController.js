const asyncHandler = require("../utils/asyncHandler");

const {
    createInventoryAdjustment
} = require("../services/inventoryAdjustmentService");

const createInventoryAdjustmentController = asyncHandler(async(req, res) => {
    const adjustment = await createInventoryAdjustment(req.body, req.user.id);

    res.status(201).json({
        success: true,
        data: adjustment
    });
});

module.exports = {
    createInventoryAdjustmentController
};