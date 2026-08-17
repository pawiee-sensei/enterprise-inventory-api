const { body, validationResult } = require("express-validator");

const handleValidationErrors = require("./handleValidationErrors");

const validateInventoryAdjustment = [

    body("product_id")
        .bail()
        .notEmpty()
        .withMessage("Product ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Product ID must be a positive integer"),

    body("quantity")
        .bail()
        .notEmpty()
        .withMessage("Quantity is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    body("type")
        .bail()
        .notEmpty()
        .withMessage("Adjustment type is required")
        .bail()
        .isIn([
            "ADJUSTMENT_IN",
            "ADJUSTMENT_OUT"
        ])
        .withMessage(
            "Adjustment type must be ADJUSTMENT_IN or ADJUSTMENT_OUT"
        ),

    body("reason")
        .bail()
        .notEmpty()
        .withMessage("Adjustment reason is required")
        .bail()
        .isString()
        .withMessage("Adjustment reason must be a string"),

    handleValidationErrors
];

module.exports = validateInventoryAdjustment;