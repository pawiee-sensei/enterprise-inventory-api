const bcrypt = require("bcrypt");

const { findUserByEmail , createUser } = require("../models/authModel");

const registerUser = async (userData) => {
    const existingUser = await findUserByEmail(userData.email);

    if(existingUser){
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        userData.password,
        10
    );

    const newUser = {
        role_id: 2,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: hashedPassword
    };

    const userId = await createUser(newUser);

    return{
        id: userId,
        email: newUser.email
    };
};

module.exports = {registerUser};

