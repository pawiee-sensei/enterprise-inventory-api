const pool = require("../database/db");

const {
    findAllInventory,
    findLowStockInventory,
    findInventoryLogsByProductId,
    findProductById,
    getInventorySummary,
    findAllInventoryLogs,
    countInventoryLogs
} = require("../models/inventoryQueryModel");

const AppError = require("../utils/AppError");

const getAllInventoryService = async () => {
    const inventory = await findAllInventory();

    return inventory;
};

const getLowStockInventoryService = async () => {
    const inventory = await findLowStockInventory();

    return inventory;
};

const getInventoryLogsByProductIdService = async (productId) => {

    const product = await findProductById(productId);

    if(!product) {
        throw new AppError("Product not found", 404);
    }

    const logs = await findInventoryLogsByProductId(productId);

    return logs;
};

const getInventorySummaryService = async () => {
    const summary = await getInventorySummary();

    return summary;
};

const getAllInventoryLogsService = async ({ page = 1, limit = 20, productId }) => {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
        findAllInventoryLogs({ limit: limitNum, offset, productId }),
        countInventoryLogs(productId)
    ]);

    return {
        logs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};



module.exports = {
    getAllInventoryService,
    getLowStockInventoryService,
    getInventoryLogsByProductIdService,
    getInventorySummaryService,
    getAllInventoryLogsService
};