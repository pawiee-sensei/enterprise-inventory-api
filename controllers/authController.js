const asyncHandler = require("../utils/asyncHandler");
const {registerUser, loginUser} = require("../services/authService");

const register = asyncHandler(async(req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
});

const login = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;

    const result = await loginUser(email, password);

    res.status(200).json(result);
});

const profile = asyncHandler(async(req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

const adminDashboard = asyncHandler(async(req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome admin!",
        user: req.user
    });
}); 

module.exports = {register, login, profile, adminDashboard};