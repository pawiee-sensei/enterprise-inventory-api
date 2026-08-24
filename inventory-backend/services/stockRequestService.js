const {
    createStockRequest,
    findAllStockRequests,
    findStockRequestById,
    updateStockRequestStatus,
} = require("../models/stockRequestModel");

const { createInventoryAdjustment } = require("./inventoryAdjustmentService");

const AppError = require("../utils/AppError");

const createStockRequestService = async (requestData, userId) => {
    const insertId = await createStockRequest({
        ...requestData,
        requested_by: userId,
    });

    return { id: insertId, ...requestData, status: "PENDING" };
};

const getAllStockRequestsService = async (status) => {
    return await findAllStockRequests(status);
};

const approveStockRequestService = async (id, reviewerId) => {
    const request = await findStockRequestById(id);

    if (!request) {
        throw new AppError("Request not found", 404);
    }

    if (request.status !== "PENDING") {
        throw new AppError("This request has already been reviewed", 400);
    }

    // reuse the exact same logic real adjustments already use
    await createInventoryAdjustment(
        {
            product_id: request.product_id,
            type: request.type,
            quantity: request.quantity,
            reason: `[Approved request #${request.id}] ${request.reason}`,
        },
        reviewerId
    );

    await updateStockRequestStatus(id, "APPROVED", reviewerId);

    return { id, status: "APPROVED" };
};

const rejectStockRequestService = async (id, reviewerId) => {
    const request = await findStockRequestById(id);

    if (!request) {
        throw new AppError("Request not found", 404);
    }

    if (request.status !== "PENDING") {
        throw new AppError("This request has already been reviewed", 400);
    }

    await updateStockRequestStatus(id, "REJECTED", reviewerId);

    return { id, status: "REJECTED" };
};

module.exports = {
    createStockRequestService,
    getAllStockRequestsService,
    approveStockRequestService,
    rejectStockRequestService,
};