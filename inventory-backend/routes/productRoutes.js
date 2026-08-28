const express = require("express");


// Imports controllers
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductAvailability
} = require("../controllers/productController");

// Imports middleware
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validateProduct = require("../middleware/validateProduct");

const router = express.Router();

// Product routes
router.post("/",authMiddleware,authorize(1), validateProduct, createProduct);
router.get("/", authMiddleware, authorize(1,2), getAllProducts);
router.get("/:id", authMiddleware, authorize(1,2), getProductById);
router.put("/:id", authMiddleware, authorize(1), validateProduct, updateProduct);
router.delete("/:id", authMiddleware, authorize(1), deleteProduct);
router.patch("/:id/availability", authMiddleware, authorize(1), updateProductAvailability);

module.exports = router;