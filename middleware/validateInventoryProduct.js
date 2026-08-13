const { param } = require("express-validator");

const handleValidationErrors = require("./handleValidationErrors");


const validateInventoryProduct = [

    param("productId")
        .bail()
        .notEmpty()
        .withMessage("Product ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Product ID must be a positive integer"),

    handleValidationErrors
];


module.exports = validateInventoryProduct;