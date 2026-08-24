const asyncHandler = require("../utils/asyncHandler");

const {
    createStockRequestService,
    getAllStockRequestsService,
    approveStockRequestService,
    rejectStockRequestService,
} = require("../services/stockRequestService");

const createStockRequest = asyncHandler(async (req, res) => {
    const request = await createStockRequestService(req.body, req.user.id);

    res.status(201).json({
        success: true,
        message: "Stock request submitted",
        data: request,
    });
});

const getAllStockRequests = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const requests = await getAllStockRequestsService(status);

    res.status(200).json({
        success: true,
        data: requests,
    });
});

const approveStockRequest = asyncHandler(async (req, res) => {
    const result = await approveStockRequestService(req.params.id, req.user.id);

    res.status(200).json({
        success: true,
        message: "Request approved and stock adjusted",
        data: result,
    });
});

const rejectStockRequest = asyncHandler(async (req, res) => {
    const result = await rejectStockRequestService(req.params.id, req.user.id);

    res.status(200).json({
        success: true,
        message: "Request rejected",
        data: result,
    });
});

module.exports = {
    createStockRequest,
    getAllStockRequests,
    approveStockRequest,
    rejectStockRequest,
};