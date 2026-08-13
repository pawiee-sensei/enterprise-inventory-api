const asyncHandler = require("../utils/asyncHandler");

const {
    getAllInventoryService,
    getLowStockInventoryService,
    getInventoryLogsByProductIdService
} = require("../services/inventoryQueryService");


const getAllInventory = asyncHandler(async (req, res) => {

    const inventory = await getAllInventoryService();

    res.status(200).json({
        success: true,
        data: inventory
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


module.exports = {
    getAllInventory,
    getLowStockInventory,
    getInventoryLogsByProductId,
};