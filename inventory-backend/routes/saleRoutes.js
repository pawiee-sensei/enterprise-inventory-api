const express = require("express");

const{
    createSale,
    getAllSales,
    getSaleById,
    getTopSellingProducts
} = require("../controllers/saleController");



const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationSale = require("../middleware/validateSale");

const router = express.Router();

router.post("/", authMiddleware, authorize(1,2), validationSale, createSale);
router.get("/", authMiddleware, authorize(1,2), getAllSales);
router.get("/insights/top-products", authMiddleware, authorize(1, 2), getTopSellingProducts);
router.get("/:id", authMiddleware, authorize(1,2), getSaleById);

module.exports = router;