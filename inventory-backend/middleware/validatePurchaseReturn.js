const {body, validationResult} = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const  validationPurchaseReturn = [

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

    handleValidationErrors

];

module.exports = validationPurchaseReturn;