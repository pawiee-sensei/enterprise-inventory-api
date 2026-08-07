const { Connection } = require("mysql2");
const pool = require("../database/db");

const findAllPurchases = async () => {
    const [rows] = await pool.execute(
        `SELECT 
            p.id,
            s.name AS supplier,
            u.name AS created_by,
            p.purchase_date,
            p.total_amount
            p.status
        FROM purchases p

        INNER JOIN suppliers s
            ON p.supplier_id = s.id

        INNER JOIN users u
            ON p.user_id = u.id

        WHERE p.is_active = 1
        ORDER BY p.id DESC`
    );

    return rows;
};

const findPurchaseById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            p.id,
            supplier_id,
            user_id,
            purchase_date,
            total_amount,
            status
        FROM purchases
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

//Operation transaction
const createPurchase = async(
    connection,
    supplierId,
    userId
) => {
    const [result] = await connection.execute(
        `INSERT INTO purchases(
            supplier_id,
            user_id
        )
        VALUES(?, ?)`,
        [supplierId, userId]
    );

    return result.insertId;
};

const createPurchaseItem = async(
    connection,
    purchaseId,
    item
) => {

    //Get the unit_cost from the product
    const subtotal = item.quantity * item.unit_cost;

    await connection.execute(
        `INSERT INTO purchase_items(
            purchase_id,
            product_id,
            quantity,
            unit_cost,
            subtotal
        )
        VALUES(?, ?, ?, ?, ?)`,
        [   
            purchaseId,
            item.product_id,
            item.quantity,
            item.unit_cost,
            subtotal
        ]
    );

    return subtotal;
};

const updatePurchaseTotal = async (
    connection,
    purchaseId,
    totalAmount
) => {

    await connection.execute(
        `
        UPDATE purchases
        SET total_amount = ?
        WHERE id = ?
        `,
        [
            totalAmount,
            purchaseId
        ]
    );
};

module.exports = {
    findAllPurchases,
    findPurchaseById,
    createPurchase,
    createPurchaseItem,
    updatePurchaseTotal
};