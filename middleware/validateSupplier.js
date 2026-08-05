const { body } = require('express-validator');

const handleValidationErrors = require('./handleValidationErrors');

const validateSupplier = [
    // Name
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Supplier name is required')
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('Supplier name must be between 2 and 100 characters'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .bail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),

    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('Phone number must be less than 20 characters'),

    body('address')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('Address must be less than 255 characters'),
    
    body('contact_person')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Contact person must be less than 100 characters'),


    // Handle validation errors
    handleValidationErrors
];

module.exports = validateSupplier;