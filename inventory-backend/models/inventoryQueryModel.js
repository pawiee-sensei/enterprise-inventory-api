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

module.exports = {
    findAllInventory,
    findLowStockInventory,
    findInventoryLogsByProductId,
    findProductById,
    getInventorySummary
};