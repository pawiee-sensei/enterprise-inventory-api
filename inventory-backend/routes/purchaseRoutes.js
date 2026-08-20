const express = require("express");

const{
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    getProductsPurchasedFromSupplier
} = require("../controllers/purchaseController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validationPurchase = require("../middleware/validatePurchase");

const router = express.Router();

router.post("/", authMiddleware, authorize(1), validationPurchase, createPurchase);
router.get("/", authMiddleware, authorize(1,2), getAllPurchases);
router.get("/:id", authMiddleware, authorize(1,2), getPurchaseById);
router.get("/supplier/:supplierId/products", authMiddleware, authorize(1,2), getProductsPurchasedFromSupplier);

module.exports = router;