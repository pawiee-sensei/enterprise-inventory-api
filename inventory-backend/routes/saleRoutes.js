const express = require("express");

const{createSale} = require("../controllers/saleController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationSale = require("../middleware/validateSale");

const router = express.Router();

router.post("/", authMiddleware, authorize(1), validationSale, createSale);

module.exports = router;