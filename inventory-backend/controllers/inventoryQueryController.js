const asyncHandler = require("../utils/asyncHandler");

const {
    getAllInventoryService,
    getLowStockInventoryService,
    getInventoryLogsByProductIdService,
    getInventorySummaryService,
    getAllInventoryLogsService
} = require("../services/inventoryQueryService");


const getAllInventory = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const { inventory, pagination } = await getAllInventoryService({ page, limit });

    res.status(200).json({
        success: true,
        count: inventory.length,
        data: inventory,
        pagination,
    });
});

const getLowStockInventory = asyncHandler(async(req,res) => {

    const inventory = await getLowStockInventoryService();

    res.status(200).json({
        success: true,
        data: inventory
    });
});

const getInventoryLogsByProductId = asyncHandler(async(req, res) => {

    const logs = await getInventoryLogsByProductIdService(req.params.productId); // req.params.productId = product id

    res.status(200).json({
        success: true,
        data: logs
    });
});

const getInventorySummary = asyncHandler(async(req, res) => {

    const summary = await getInventorySummaryService();

    res.status(200).json({
        success: true,
        data: summary
    });
})

const getAllInventoryLogs = asyncHandler(async (req, res) => {
    const { page, limit, productId } = req.query;

    const result = await getAllInventoryLogsService({ page, limit, productId });

    res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination
    });
});

module.exports = {
    getAllInventory,
    getLowStockInventory,
    getInventoryLogsByProductId,
    getInventorySummary,
    getAllInventoryLogs
};