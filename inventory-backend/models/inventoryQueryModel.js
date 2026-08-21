const pool = require("../database/db");

// Get all products with their current stock.
// product.id = products.id
// product.stock = products.stock
// category = categories.name
// supplier = suppliers.name
const findAllInventory = async() => {
    const [rows] = await pool.execute(
        `SELECT
            p.id,
            p.sku,
            p.name,
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

// Get products that are at or below their minimum stock level.
// stock = products.stock
// minimum_stock = products.minimum_stock
const findLowStockInventory = async() => {
    const [rows] = await pool.execute(
        `
        SELECT
            p.id,
            p.sku,
            p.name,
            p.stock,
            p.minimum_stock,
            c.name AS category,
            s.name AS supplier
        FROM products p
        
        INNER JOIN categories c
            ON p.category_id = c.id
        INNER JOIN suppliers s
            ON p.supplier_id = s.id
        
        WHERE p.stock <= p.minimum_stock
        ORDER BY p.stock ASC
        `
    );

    return rows;
};
// Get all inventory logs for a specific product
// id = inventory_logs.id
// product_id = inventory_logs.product_id
// user_id = inventory_logs.user_id
const findInventoryLogsByProductId = async (productId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            product_id,
            user_id,
            movement_type,
            quantity,
            previous_stock,
            new_stock,
            reference_type,
            reference_id,
            remarks,
            created_at
        FROM inventory_logs
        WHERE product_id = ?
        ORDER BY id DESC
        `,
        [productId]
    );
    return rows;
};

const findProductById = async (productId) => {
    const [rows] = await pool.execute(
        `SELECT
            id
        FROM products
        WHERE id = ?`,
        [productId]
    );
    return rows[0];
};

// Get inventory summary statistics.
// total_products = number of products
// total_stock = total quantity across all products
// low_stock_products = products where stock <= minimum_stock
// out_of_stock_products = products where stock = 0

const getInventorySummary = async() => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_products,
            COALESCE(SUM(stock), 0) AS total_stock,
            SUM(
                CASE
                    WHEN stock <= minimum_stock
                    THEN 1
                    ELSE 0
                END
            ) AS low_stock_products,
            SUM(
                CASE
                    WHEN stock = 0
                    THEN 1
                    ELSE 0
                END
            ) AS out_of_stock_products
        FROM products
        `
    );

    return rows[0];
};

const findAllInventoryLogs = async ({ limit, offset, productId }) => {
    let query = `
        SELECT
            il.id,
            il.product_id,
            p.name AS product_name,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            il.movement_type,
            il.quantity,
            il.previous_stock,
            il.new_stock,
            il.reference_type,
            il.reference_id,
            il.remarks,
            il.created_at
        FROM inventory_logs il
        INNER JOIN products p ON il.product_id = p.id
        INNER JOIN users u ON il.user_id = u.id
    `;

    const params = [];

    // productId is optional
    if (productId) {
        query += ` WHERE il.product_id = ? `;
        params.push(productId);
    }

    // limit/offset are pre-validated numbers, safe to interpolate directly
    query += ` ORDER BY il.id DESC LIMIT ${limit} OFFSET ${offset} `;

    const [rows] = await pool.execute(query, params);
    return rows;
};

const countInventoryLogs = async (productId) => {
    let query = `SELECT COUNT(*) AS total FROM inventory_logs`;
    const params = [];

    if (productId) {
        query += ` WHERE product_id = ?`;
        params.push(productId);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
};

module.exports = {
    findAllInventory,
    findLowStockInventory,
    findInventoryLogsByProductId,
    findProductById,
    getInventorySummary,
    findAllInventoryLogs,
    countInventoryLogs
};