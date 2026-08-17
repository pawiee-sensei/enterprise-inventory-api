const express = require("express");

const {
    createPurchaseReturn
} = require("../controllers/purchaseReturnController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationPurchaseReturn = require("../middleware/validatePurchaseReturn");

const router = express.Router();

router.post("/:id/return", authMiddleware, authorize(1,2), validationPurchaseReturn, createPurchaseReturn);

module.exports = router;