const pool = require("../database/db");

const {
    findAllInventory,
    findLowStockInventory
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

module.exports = {
    getAllInventoryService,
    getLowStockInventoryService
};