const express = require("express");

const {
    getAllInventory,
    getLowStockInventory,
    getInventoryLogsByProductId,
    getInventorySummary,
    getAllInventoryLogs
} = require("../controllers/inventoryQueryController");

const authMiddleware = require("../middleware/authMiddleware");
const autorize = require("../middleware/authorizeMiddleware");
const validateInventoryProduct = require("../middleware/validateInventoryProduct");

const router = express.Router();


// Get all products with current inventory stock.
router.get(
    "/",
    authMiddleware,
    autorize(1, 2),
    getAllInventory
);

// Get all products with low stock.
router.get(
    "/low-stock",
    authMiddleware,
    autorize(1, 2),
    getLowStockInventory
);

router.get(
    "/logs",
    authMiddleware,
    autorize(1, 2),
    getAllInventoryLogs
);

router.get(
    "/:productId/logs",
    authMiddleware,
    autorize(1, 2),
    validateInventoryProduct,
    getInventoryLogsByProductId
);

router.get(
    "/summary",
    authMiddleware,
    autorize(1, 2),
    getInventorySummary
);





module.exports = router;