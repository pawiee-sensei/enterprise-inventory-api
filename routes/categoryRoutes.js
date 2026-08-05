const express = require('express');

const {
    createCategory,
    getAllCategories,
    getCategoryById
} = require('../controllers/categoryController');

const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const validateCategory = require('../middleware/validateCategory');

const router = express.Router();

router.post('/', authMiddleware, authorize(1), validateCategory, createCategory);
router.get('/', authMiddleware, authorize(1, 2), getAllCategories);
router.get('/:id', authMiddleware, authorize(1, 2), validateCategory, getCategoryById);


module.exports = router;