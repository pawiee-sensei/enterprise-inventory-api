const express = require("express");

const{createPurchase} = require("../controllers/purchaseController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationPurchase = require("../middleware/validatePurchase");

const router = express.Router();

router.post("/", authMiddleware, authorize(1), validationPurchase, createPurchase);

module.exports = router;