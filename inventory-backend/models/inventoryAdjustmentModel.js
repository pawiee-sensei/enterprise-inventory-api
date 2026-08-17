const pool = require("../database/db");

const findProductForUpdate = async(
    connection,
    productId   //products.id
) => {

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

const increaseProductStock = async(
    connection,
    productId,
    quantity
) => {

    await connection.execute(
        `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?`,
        [
            quantity,
            productId
        ]
    );
};

const decreaseProductStock = async(
    connection,
    productId,
    quantity
) => {

    await connection.execute(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?`,
        [
            quantity,
            productId
        ]
    );
};

module.exports = {
    findProductForUpdate,
    increaseProductStock,
    decreaseProductStock
};