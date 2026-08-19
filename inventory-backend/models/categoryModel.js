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
            AND is_active = 1
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
            AND is_active = 1
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

const updateCategory = async (id, categoryData) => {
    const { name, description } = categoryData;

    const [result] = await pool.execute(
        `
        UPDATE categories
        SET
            name = ?,
            description = ?
        WHERE id = ?
        AND is_active = 1
        `,
        [name, description, id]
    );

    return result.affectedRows;
};

const deleteCategory = async (id) => {

    const [result] = await pool.execute(
        `
        UPDATE categories
        SET is_active = 0
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows;
};


module.exports = {
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
};