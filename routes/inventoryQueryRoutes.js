const express = require("express");

const {
    getAllInventory,
    getLowStockInventory
} = require("../controllers/inventoryQueryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all products with current inventory stock.
router.get(
    "/",
    authMiddleware,
    getAllInventory
);

// Get all products with low stock.
router.get(
    "/low-stock",
    authMiddleware,
    getLowStockInventory
);

module.exports = router;