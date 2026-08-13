const asyncHandler = require("../utils/asyncHandler");

const {
    getAllInventoryService,
    getLowStockInventoryService
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


module.exports = {
    getAllInventory,
    getLowStockInventory
};