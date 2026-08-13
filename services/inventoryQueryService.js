const pool = require("../database/db");

const {
    findAllInventory
} = require("../models/inventoryQueryModel");

const AppError = require("../utils/AppError");

const getAllInventoryService = async () => {
    const inventory = await findAllInventory();

    return inventory;
};

module.exports = {getAllInventoryService};