const pool = require("../database/db");

    const findAllCategories = async () => {
        const [rows] = await pool.execute(
            `
            SELECT
                id,
                name,
                description
            FROM categories
            WHERE is_active = 1
            ORDER BY id ASC
            `
        );

        return rows;
    };

    const findCategoryById = async (id) => {
        const [rows] = await pool.execute(
            `
            SELECT
                id,
                name,
                description
            FROM categories
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    };

    const findCategoryByName = async (name) => {
        const [rows] = await pool.execute(
            `
            SELECT *
            FROM categories
            WHERE name = ?
            `,
            [name]
        );

        return rows[0];
    };

    const createCategory = async (categoryData) => {
        const { name, description } = categoryData;

        const [result] = await pool.execute(
            `
            INSERT INTO categories(
                name,
                description
            )
                VALUES(?, ?)
            `,
            [
                name,
                description
            ]
        );

        return result.insertId;
    };


module.exports = {
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    createCategory
};