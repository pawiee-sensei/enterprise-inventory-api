const express = require("express");

const {
    getAllInventory
} = require("../controllers/inventoryQueryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all products with current inventory stock.
router.get(
    "/",
    authMiddleware,
    getAllInventory
);

module.exports = router;