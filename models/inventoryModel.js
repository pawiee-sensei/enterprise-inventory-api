const pool = require("../database/db");

const findProductForUpdate = async (
    connection,
    productId
) => {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            stock
        FROM products
        WHERE id = ?
        `,
        [productId]
    );

    return rows[0];
};

const increaseProductStock = async(
    connection,
    productId,
    quantity
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

const createInventoryLog = async(
    connection,
    logData
) => {
    const {
        productId,
        userId,
        quantity,
        previousStock,
        newStock,
        purchaseId,
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
        VALUES(?, ?,'PURCHASE', ?, ?, ?, 'PURCHASE', ?, ?)
        `,
        [
            productId,
            userId,
            quantity,
            previousStock,
            newStock,
            purchaseId,
            remarks
        ]
    );
};

module.exports = {
    findProductForUpdate,
    increaseProductStock,
    createInventoryLog
};