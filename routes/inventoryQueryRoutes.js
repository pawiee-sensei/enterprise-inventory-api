const express = require("express");

const {
    getAllInventory,
    getLowStockInventory,
    getInventoryLogsByProductId,
    getInventorySummary
} = require("../controllers/inventoryQueryController");

const authMiddleware = require("../middleware/authMiddleware");
const autorize = require("../middleware/authorizeMiddleware");
const validateInventoryProduct = require("../middleware/validateInventoryProduct");

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

router.get(
    "/:productId/logs",
    authMiddleware,
    validateInventoryProduct,
    getInventoryLogsByProductId
);

router.get(
    "/summary",
    authMiddleware,
    getInventorySummary
);

module.exports = router;