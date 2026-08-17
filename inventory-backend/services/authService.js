const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { findUserByEmail , createUser } = require("../models/authModel");

//check if user exists
const registerUser = async (userData) => {
    const existingUser = await findUserByEmail(userData.email);

    if(existingUser){
        throw new Error("Email already exists");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(
        userData.password,
        10
    );

    //prepare user data
    const newUser = {
        role_id: 2,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: hashedPassword
    };

    //send to authModel
    const userId = await createUser(newUser);

    return{
        id: userId,
        email: newUser.email
    };
};

const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if(!user){
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if(!passwordMatch){
        throw new Error("Invalid email or password");
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role_id
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return{
        success: true,
        token,
        user:{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id
        }
    };
};

module.exports = {registerUser, loginUser};

