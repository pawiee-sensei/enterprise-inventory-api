const { body , validationResult } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateProduct = [

    //SKU
    body("sku")
        .notEmpty()
        //if sku is empty, return an error message
        .withMessage("SKU is required"),

    //Name
    body("name")
        .notEmpty()
        //if name is empty, return an error message
        .withMessage("Name is required")
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    //Cost Price
    body("cost_price")
        .notEmpty()
        //if cost price is empty, return an error message
        .withMessage("Cost price is required")
        .bail()
        .isFloat({ min: 0 })
        //if cost price is not a positive number, return an error message
        .withMessage("Cost price must be a positive number"),

    //Selling Price
    body("selling_price")
        .notEmpty()
        //if selling price is empty, return an error message
        .withMessage("Selling price is required")
        .bail()
        .isFloat({ min: 0 })
        //if selling price is not a positive number, return an error message
        .withMessage("Selling price must be a positive number"),

    //Stock
    body("stock")
        .notEmpty()
        //if stock is empty, return an error message
        .withMessage("Stock is required")
        .bail()
        .isInt({ min: 0 })
        //if stock is not a non-negative integer, return an error message
        .withMessage("Stock must be a non-negative integer"),

    //Minimum Stock
    body("minimum_stock")
        .notEmpty()
        //if minimum stock is empty, return an error message
        .withMessage("Minimum stock is required")
        .bail()
        .isInt({ min: 0 })
        //if minimum stock is not a non-negative integer, return an error message
        .withMessage("Minimum stock must be a non-negative integer"),

    //category_id
    body("category_id")
        .notEmpty()
        //if category id is empty, return an error message
        .withMessage("Category is required")
        .bail()
        .isInt({ min: 1 })
        //if category id is not a positive integer, return an error message
        .withMessage("Category ID must be a positive integer"),

    //supplier_id
    body("supplier_id")
        .notEmpty()
        //if supplier id is empty, return an error message
        .withMessage("Supplier is required")
        .bail()
        .isInt({ min: 1 })
        //if supplier id is not a positive integer, return an error message
        .withMessage("Supplier ID must be a positive integer"),

    //Final Validation Result
    handleValidationErrors
];

module.exports = validateProduct;