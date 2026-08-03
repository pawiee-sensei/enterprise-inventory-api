    const pool = require("../database/db");

    const findAllProducts = async () => {
        const [rows] = await pool.execute(
            `
            SELECT
                p.id,
                p.sku,
                p.name,
                p.description,
                p.cost_price,
                p.selling_price,
                p.stock,
                p.minimum_stock,
                c.name AS category,
                s.name AS supplier
            FROM products p

            INNER JOIN categories c
                ON p.category_id = c.id
            INNER JOIN suppliers s
                ON p.supplier_id = s.id
            ORDER BY p.id DESC
            `
        );

        return rows;
    };

    const findProductById = async (id) => {
        const [rows] = await pool.execute(
            `
            SELECT
                p.id,
                p.sku,
                p.name,
                p.description,
                p.cost_price,
                p.selling_price,
                p.stock,
                p.minimum_stock,
                p.is_active,
                c.name AS category,
                s.name AS supplier
            FROM products p
            INNER JOIN categories c
                ON p.category_id = c.id
            INNER JOIN suppliers s
                ON p.supplier_id = s.id
            WHERE p.id = ?;
            `,
            [id]
        );

        return rows[0];
    };

    const findProductBySku = async (sku) => {
        const [rows] = await pool.execute(
            `SELECT * FROM products WHERE sku = ?`,
            [sku]
        );

        return rows[0];
    };

    const createProduct = async (productData) => {
        const {
            sku,
            name,
            description,
            cost_price,
            selling_price,
            stock,
            minimum_stock,
            category_id,
            supplier_id
        } = productData;

        const [result] = await pool.execute(
            `
            INSERT INTO products(
                sku,
                name,
                description,
                cost_price,
                selling_price,
                stock,
                minimum_stock,
                category_id,
                supplier_id
            )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                sku,
                name,
                description,
                cost_price,
                selling_price,
                stock,
                minimum_stock,
                category_id,
                supplier_id
            ]
        );

        return result.insertId;
    };

    const findCategoryById = async (id) => {
    const [rows] = await pool.execute(
        `
        SELECT id
        FROM categories
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

const findSupplierById = async (id) => {
    const [rows] = await pool.execute(
        `
        SELECT id
        FROM suppliers
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

    module.exports = {
        findAllProducts,
        findProductById,
        findProductBySku,
        createProduct,
        findCategoryById,
        findSupplierById
    };