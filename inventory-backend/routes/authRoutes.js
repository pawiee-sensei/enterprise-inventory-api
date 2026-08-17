const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorizeMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
    register,
    login,
    profile,
    adminDashboard
} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.get("/admin", authMiddleware, authorize(1), adminDashboard);

module.exports = router;