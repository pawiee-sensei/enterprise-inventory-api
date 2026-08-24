const express = require("express");

const {
    createStockRequest,
    getAllStockRequests,
    approveStockRequest,
    rejectStockRequest,
} = require("../controllers/stockRequestController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorize(1, 2), createStockRequest);
router.get("/", authMiddleware, authorize(1, 2), getAllStockRequests);
router.put("/:id/approve", authMiddleware, authorize(1), approveStockRequest);
router.put("/:id/reject", authMiddleware, authorize(1), rejectStockRequest);

module.exports = router;