const pool = require("../database/db");

const createSaleReturn = async(
    connection,
    returnData
) => {

    const {
        sale_id, // sales.id
        user_id, // users.id
        reason   // string
    } = returnData;

    const [result] = await connection.execute(
        `
        INSERT INTO sale_returns(
            sale_id,
            user_id,
            reason
        )
        VALUES(?, ?, ?)
        `,
        [
            sale_id,
            user_id,
            reason
        ]
    );

    return result.insertId;
};

// Create one product inside the sale return.
// sale_return_id = sale_returns.id → sale_return_items.sale_return_id
// product_id = products.id → sale_return_items.product_id
// quantity = sale_return_items.quantity
const createSaleReturnItem = async(
    connection,
    itemData // from table sale_return_items
) => {

    const {
        sale_return_id, // sale_returns.id from sale_return_items
        product_id,     // products_id from sale_return_items
        quantity        // quantity from sale_return_items
    } = itemData;

    await connection.execute(
        `
        INSERT INTO sale_return_items(
            sale_return_id,
            product_id,
            quantity
        )
        VALUES(?, ?, ?)
        `,
        [
            sale_return_id,
            product_id,
            quantity
        ]
    );
};
// Find the original sale being returned.
// saleId = sales.id
// Returns: sales.id and sales.status
const findSaleForReturn = async(
    connection,
    saleId // sales.id
) => {

    const [rowss] = await connection.execute(
        `
        SELECT
            id,
            status
        FROM sales
        WHERE id = ?
        `,
        [saleId]
    );

    return rowss[0];
};

// Find a product inside the original sale.
// saleId = sales.id
// productId = products.id
// Returns: sale_items.product_id and sale_items.quantity
const findSaleItemForReturn = async(
    connection,
    saleId,
    productId
) => {

    const [rows] = await connection.execute(
        `
        SELECT
            product_id,
            quantity
        FROM sale_items
        WHERE sale_id = ?
        AND product_id = ?
        `,
        [
            saleId,
            productId
        ]
    );

    return rows[0];
};

const findReturnQuantity = async(
    connection,
    saleId,
    productId

) => {
    const [rows] = await connection.execute(
        `
        SELECT
            COALESCE(SUM(sri.quantity), 0) AS returned_quantity
        FROM sale_return_items sri

        INNER JOIN sale_returns sr
            ON sri.sale_return_id = sr.id
        WHERE sr.sale_id = ?
        AND sri.product_id = ?
        `,
        [
            saleId,
            productId
        ]
    );

    return rows[0].returned_quantity;
};

module.exports = {
    createSaleReturn,
    createSaleReturnItem,
    findSaleForReturn,
    findSaleItemForReturn,
    findReturnQuantity
};

