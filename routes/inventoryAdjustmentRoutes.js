const express = require("express");

const {
    createInventoryAdjustmentController
} = require("../controllers/inventoryAdjustmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationInventoryAdjustment = require("../middleware/validateInventoryAdjustment");

const router = express.Router();

router.post("/", authMiddleware, authorize(1), validationInventoryAdjustment, createInventoryAdjustmentController);

module.exports = router;