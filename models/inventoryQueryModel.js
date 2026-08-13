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

module.exports = { findAllInventory };