const { body, validationResult } = require('express-validator');

const handleValidationErrors = require('./handleValidationErrors');

const validateCategory = [
    // Name
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('Category name must be between 2 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Description must be less than 255 characters'),

    // Handle validation errors
    handleValidationErrors
]

module.exports = validateCategory;  