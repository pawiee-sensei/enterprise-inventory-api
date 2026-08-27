
const pool = require("../database/db");

const findAllPurchases = async ({ limit, offset } = {}) => {
    let query = `
        SELECT
            p.id,
            s.name AS supplier,
            CONCAT(u.first_name, ' ', u.last_name) AS created_by,
            p.purchase_date,
            p.total_amount,
            p.status
        FROM purchases p
        INNER JOIN suppliers s ON p.supplier_id = s.id
        INNER JOIN users u ON p.user_id = u.id
        ORDER BY p.id DESC
    `;

    if (limit !== undefined) {
        query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)} `;
    }

    const [rows] = await pool.execute(query);
    return rows;
};
const countPurchases = async () => {
    const [rows] = await pool.execute(`SELECT COUNT(*) AS total FROM purchases`);
    return rows[0].total;
};

const findPurchaseById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            p.id,
            s.name AS supplier,
            CONCAT(u.first_name, ' ', u.last_name) AS created_by,
            p.purchase_date,
            p.total_amount,
            p.status
        FROM purchases p

        INNER JOIN suppliers s
            ON p.supplier_id = s.id

        INNER JOIN users u
            ON p.user_id = u.id

        WHERE p.id = ?
        `,
        [id]
    );

    return rows[0];
};

const findPurchaseItems = async(purchaseId) => {
    const [rows] = await pool.execute(
        `SELECT
            pi.id,
            p.id AS product_id,
            p.name AS product,
            pi.quantity,
            pi.unit_cost,
            pi.subtotal
        FROM purchase_items pi

        INNER JOIN products p
            ON pi.product_id = p.id

        WHERE pi.purchase_id = ?
        `,
        [purchaseId]
    );

    return rows;
};

//Operation transaction
const createPurchase = async(
    connection,
    //from table purchases
    purchaseData
) => {

    const {
        supplier_id, //suppliers.id
        user_id,     //users.id
        total_amount //purchases.total_amount
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

const findProductsPurchasedFromSupplier = async (supplierId) => {
    const [rows] = await pool.execute(
        `
        SELECT DISTINCT
            p.id,
            p.name,
            p.cost_price
        FROM purchase_items pi
        INNER JOIN purchases pu
            ON pi.purchase_id = pu.id
        INNER JOIN products p
            ON pi.product_id = p.id
        WHERE pu.supplier_id = ?
        ORDER BY p.name
        `,
        [supplierId]
    );

    return rows;
};


module.exports = {
    findAllPurchases,
    findPurchaseById,
    findPurchaseItems,
    createPurchase,
    createPurchaseItem,
    findProductsPurchasedFromSupplier,
    countPurchases
};