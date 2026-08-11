const {body, validationResult} = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateSale = [

    body("items")
        .bail()
        .notEmpty()
        .withMessage("Items are required")
        .bail()
        .isArray({ min: 1 })
        .withMessage("At least one item is required"),

    body("items.*.product_id")
        .bail()
        .notEmpty()
        .withMessage("Product ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Product ID must be a positive integer"),

    body("items.*.quantity")
        .bail()
        .notEmpty()
        .withMessage("Quantity is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    handleValidationErrors
];

module.exports = validateSale;