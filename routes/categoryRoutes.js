const express = require('express');

const {
    createCategory,
    getAllCategories,
    getCategoryById
} = require('../controllers/categoryController');

const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorize(1), createCategory);
router.get('/', authMiddleware, authorize(1, 2), getAllCategories);
router.get('/:id', authMiddleware, authorize(1, 2), getCategoryById);

module.exports = router;