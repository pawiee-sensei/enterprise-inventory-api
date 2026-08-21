const pool = require("../database/db");

// Create the purchase return record.
// Needs: purchase_id, user_id, reason from table purchase_returns
const createPurchaseReturn = async (
    connection,
    returnData 
) => {
    
    const {
        purchase_id, // purchases.id
        user_id,    // users.id
        reason      // string
    } = returnData;

    const [result] = await connection.execute(
        `
        INSERT INTO purchase_returns(
            purchase_id,
            user_id,
            reason
        )
        VALUES(?, ?, ?)
        `,
        [
            purchase_id,
            user_id,
            reason
        ]
    );

    return result.insertId;
};


// Create one product item inside the purchase return.
// Needs: purchase_return_id, product_id, quantity from table purchase_return_items
const createPurchaseReturnItem = async (
    connection,
    itemData
) => {

    const {
        purchase_return_id,
        product_id,
        quantity
    } = itemData;

    await connection.execute(
        `
        INSERT INTO purchase_return_items(
            purchase_return_id,
            product_id,
            quantity
        )
        VALUES(?, ?, ?)
        `,
        [
            purchase_return_id,
            product_id,
            quantity
        ]
    );
};


// Find the original purchase we want to return.
// Needs purchaseId.
// Returns: purchase id and status.
const findPurchaseForReturn = async (
    connection,
    purchaseId
) => {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            status
        FROM purchases
        WHERE id = ?
        `,
        [purchaseId]
    );

    return rows[0];
};


// Find a specific product inside the original purchase.
// Needs: purchaseId and productId.
// Returns: product id and originally purchased quantity.
const findPurchaseItemForReturn = async (
    connection,
    purchaseId,
    productId
) => {

    const [rows] = await connection.execute(
        `
        SELECT
            product_id,
            quantity
        FROM purchase_items
        WHERE purchase_id = ?
        AND product_id = ?
        `,
        [
            purchaseId,
            productId
        ]
    );

    return rows[0];
};

const findReturnedQuantitiesByPurchaseId = async (purchaseId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            pri.product_id,
            SUM(pri.quantity) AS returned_quantity
        FROM purchase_return_items pri
        INNER JOIN purchase_returns pr
            ON pri.purchase_return_id = pr.id
        WHERE pr.purchase_id = ?
        GROUP BY pri.product_id
        `,
        [purchaseId]
    );

    return rows;
};


module.exports = {
    createPurchaseReturn,
    createPurchaseReturnItem,
    findPurchaseForReturn,
    findPurchaseItemForReturn,
    findReturnedQuantitiesByPurchaseId

};