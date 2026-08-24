const express = require("express");

const {
    createSaleReturn
} = require("../controllers/saleReturnController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationSaleReturn = require("../middleware/validateSaleReturn");

const router = express.Router();

router.post("/:id", authMiddleware, authorize(1), validationSaleReturn, createSaleReturn);

module.exports = router;