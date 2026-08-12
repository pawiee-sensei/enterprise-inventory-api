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

module.exports = {
    createSale,
    createSaleItem
};