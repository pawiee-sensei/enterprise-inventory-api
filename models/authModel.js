const pool = require("../database/db");

const findUserByEmail  = async(email) => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );

    return rows[0];
};

const createUser = async(userData) => {
    const {
        role_id,
        first_name,
        last_name,
        email,
        password
    } = userData;

    const [result] = await pool.execute(
        `
        INSERT INTO users(
            role_id,
            first_name,
            last_name,
            email,
            password
        )
            VALUES(?, ?, ?, ?, ?)
        `,
        [
            role_id,
            first_name,
            last_name,
            email,
            password
        ]
    );

    return result.insertId;
};

module.exports = {findUserByEmail , createUser};