const express = require("express");

const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validateSupplier = require("../middleware/validateSupplier");

const router = express.Router();

router.post("/", authMiddleware, authorize(1), validateSupplier, createSupplier);
router.get("/", authMiddleware, authorize(1, 2), getAllSuppliers);
router.get("/:id", authMiddleware, authorize(1, 2), getSupplierById);
router.put("/:id", authMiddleware, authorize(1), validateSupplier, updateSupplier);
router.delete("/:id", authMiddleware, authorize(1), deleteSupplier);

module.exports = router;