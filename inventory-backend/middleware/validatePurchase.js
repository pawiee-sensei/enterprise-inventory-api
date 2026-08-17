const { body, validationResult } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validationPurchase = [

    body("supplier_id")
        .bail()
        .notEmpty()
        .withMessage("Supplier is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Supplier ID must be a positive integer"),

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

    body("items.*.unit_cost")
        .bail()
        .notEmpty()
        .withMessage("Unit cost is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Unit cost must be a positive number"),

    handleValidationErrors

];

module.exports = validationPurchase;