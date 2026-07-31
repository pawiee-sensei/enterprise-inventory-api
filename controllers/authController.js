const asyncHandler = require("../utils/asyncHandler");
const {registerUser} = require("../services/authService");

const register = asyncHandler(async(req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
});

module.exports = {register};