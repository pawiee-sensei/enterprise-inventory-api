const {validationResult} = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.param,
            message: error.msg
        }));

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formattedErrors
        });
    }

    next();
};

module.exports = handleValidationErrors;