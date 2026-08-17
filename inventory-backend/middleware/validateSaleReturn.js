const {body, validationResult} = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validationSaleReturn = [

    body("reason")
        .notEmpty()
        .withMessage("Reason is required")
        .bail()
        .isString()
        .withMessage("Reason must be a string"),

    body("items")
        .bail()
        .notEmpty()
        .withMessage("Items are required")
        .bail()
        .isArray({ min: 1 })
        .withMessage("At least one item is required"),

    body("items.*.quantity")
        .bail()
        .notEmpty()
        .withMessage("Quantity is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    body("items.*.product_id")
        .bail()
        .notEmpty()
        .withMessage("Product ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Product ID must be a positive integer"),

    handleValidationErrors
];

module.exports = validationSaleReturn;