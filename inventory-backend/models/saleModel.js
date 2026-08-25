const pool = require("../database/db");

// Create the main sale record.
// userId = users.id
// totalAmount = calculated total of all sale_items
const createSale = async (
    connection,
    saleData // from table sales
) => {

    const {
        user_id, // users.id → sales.user_id (FK)
        total_amount // sales.total_amount
    } = saleData;

    const [result] = await connection.execute(
        `
        INSERT INTO sales(
            user_id, 
            total_amount
        )
            VALUES(?, ?)
        `,
        [
            user_id,
            total_amount
        ]
    );

    return result.insertId;
};
// Create one product inside the sale.
// sale_id = sales.id
// product_id = products.id
// quantity = req.body.items[].quantity
// unit_price = price used at the time of sale
// subtotal = quantity × unit_price
const createSaleItem = async(
    Connection,
    itemData // from table sale_items
) => {

    const {
        sale_id, // sales.id → sale_items.sale_id (FK)
        product_id, // products.id → sale_items.product_id (FK)
        quantity, // sale_items.quantity
        unit_price, // sale_items.unit_price
        subtotal// sale_items.subtotal
    } = itemData;

    await Connection.execute(  
        `
        INSERT INTO sale_items(
            sale_id,
            product_id,
            quantity,
            unit_price,
            subtotal
        )
            VALUES(?, ?, ?, ?, ?)
        `,
        [
            sale_id,
            product_id,
            quantity,
            unit_price,
            subtotal
        ]
    );
};
// Find all sales
// Returns: sales.id, sales.created_by, sales.sale_date, sales.total_amount, sales.status from sales
// and users.first_name, users.last_name from users
const findAllSales = async () => {
    const [rows] = await pool.execute(
        `SELECT
            s.id,
            CONCAT(u.first_name, ' ', u.last_name) AS created_by,
            s.sale_date,
            s.total_amount,
            s.status
        FROM sales s

        INNER JOIN users u
            ON s.user_id = u.id

        ORDER BY s.id DESC`
    );

    return rows;
};

// Find one sale
// saleId = sales.id
// Returns: sales.id, sales.created_by, sales.sale_date, sales.total_amount, sales.status from sales
//  and users.first_name, users.last_name from users
const findSaleById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            s.id,
            CONCAT(u.first_name, ' ', u.last_name) AS created_by,
            s.sale_date,
            s.total_amount,
            s.status
        FROM sales s

        INNER JOIN users u
            ON s.user_id = u.id

        WHERE s.id = ?
        `,
        [id]
    );

    return rows[0];
};

// Find all products inside one sale.
// saleId = sales.id
// Returns: sale_items.product_id and sale_items.quantity
const findSaleItems = async (saleId) => {
    const [rows] = await pool.execute(
        `SELECT
            si.id,
            p.id AS product_id,
            p.name AS product,
            si.quantity,
            si.unit_price,
            si.subtotal
        FROM sale_items si

        INNER JOIN products p
            ON si.product_id = p.id

        WHERE si.sale_id = ?
        `,
        [saleId]
    );

    return rows;
};

const findTopSellingProducts = async (limit) => {
    const [rows] = await pool.execute(
        `
        SELECT
            p.id,
            p.name,
            SUM(si.quantity) AS total_quantity,
            SUM(si.subtotal) AS total_revenue
        FROM sale_items si
        INNER JOIN products p ON si.product_id = p.id
        GROUP BY p.id, p.name
        ORDER BY total_quantity DESC
        LIMIT ${Number(limit)}
        `
    );

    return rows;
};



module.exports = {
    createSale,
    createSaleItem,
    findAllSales,
    findSaleById,
    findSaleItems,
    findTopSellingProducts
};