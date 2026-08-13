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

module.exports = {
    findAllInventory,
    findLowStockInventory,
    findInventoryLogsByProductId,
    findProductById
};