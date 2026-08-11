const pool = require("../database/db");


const findProductForUpdate = async (
    connection,
    productId // products.id
) => {

    // Read the current stock and lock this product
    // until the transaction is completed.
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            stock
        FROM products
        WHERE id = ?
        FOR UPDATE
        `,
        [productId]
    );

    return rows[0];
};


// Increase product stock after a supplier purchase.
const increaseProductStock = async (
    connection,
    productId, // products.id
    quantity   // purchase_items.quantity
) => {

    await connection.execute(
        `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
        `,
        [quantity, productId]
    );
};


// Decrease product stock when purchased products are returned.
const decreaseProductStock = async (
    connection,
    productId, // products.id
    quantity   // purchase_return_items.quantity
) => {

    const [result] = await connection.execute(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [quantity, productId]
    );

    return result.affectedRows;
};


// Create an inventory movement log.
const createInventoryLog = async (
    connection,
    logData
) => {

    const {
        productId,
        userId,
        quantity,
        previousStock,
        newStock,
        movementType,
        referenceType,
        referenceId,
        remarks
    } = logData;

    await connection.execute(
        `
        INSERT INTO inventory_logs(
            product_id,
            user_id,
            movement_type,
            quantity,
            previous_stock,
            new_stock,
            reference_type,
            reference_id,
            remarks
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            productId,
            userId,
            movementType,
            quantity,
            previousStock,
            newStock,
            referenceType,
            referenceId,
            remarks
        ]
    );
};


module.exports = {
    findProductForUpdate,
    increaseProductStock,
    decreaseProductStock,
    createInventoryLog
};