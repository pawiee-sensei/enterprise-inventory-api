const pool = require("../database/db");

const {
    findAllInventory,
    findLowStockInventory,
    findInventoryLogsByProductId,
    findProductById
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



module.exports = {
    getAllInventoryService,
    getLowStockInventoryService,
    getInventoryLogsByProductIdService
};