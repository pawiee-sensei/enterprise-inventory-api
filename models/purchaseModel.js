
const pool = require("../database/db");

const findAllPurchases = async () => {
    const [rows] = await pool.execute(
        `SELECT 
            p.id,
            s.name AS supplier,
            u.name AS created_by,
            p.purchase_date,
            p.total_amount,
            p.status
        FROM purchases p

        INNER JOIN suppliers s
            ON p.supplier_id = s.id

        INNER JOIN users u
            ON p.user_id = u.id

        ORDER BY p.id DESC`
    );

    return rows;
};

const findPurchaseById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            id,
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
    //from table purchases
    purchaseData
) => {

    const {
        supplier_id,
        user_id,
        total_amount
    } = purchaseData;

    const [result] = await connection.execute(
        `INSERT INTO purchases(
            supplier_id,
            user_id,
            total_amount
        )
        VALUES(?, ?, ?)`,
        [supplier_id, user_id, total_amount]
    );

    return result.insertId;
};

const createPurchaseItem = async(
    connection,
    //array of purchase items
    itemData
) => {

    const {
        purchase_id,
        product_id,
        quantity,
        unit_cost,
        subtotal
    } = itemData;

    //Insert the purchase item
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
            purchase_id,
            product_id,
            quantity,
            unit_cost,
            subtotal
        ]
    );

    return subtotal;
};


module.exports = {
    findAllPurchases,
    findPurchaseById,
    createPurchase,
    createPurchaseItem,
};