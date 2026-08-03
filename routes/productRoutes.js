const express = require("express");

// Imports controllers
const {
    createProduct
} = require("../controllers/productController");

// Imports middleware
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const router = express.Router();

// Product routes
router.post("/",authMiddleware,authorize(1), createProduct);

module.exports = router;