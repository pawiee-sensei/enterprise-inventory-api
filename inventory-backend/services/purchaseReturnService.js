const pool = require("../database/db");

const {
    createPurchaseReturn,
    createPurchaseReturnItem,
    findPurchaseForReturn,
    findPurchaseItemForReturn
} = require("../models/purchaseReturnModel");

const {
    findProductForUpdate,
    decreaseProductStock,
    createInventoryLog
} = require("../models/inventoryModel");

const AppError = require("../utils/AppError");

// Create a purchase return.
const createPurchaseReturnService = async (
    purchaseId,     // purchases.id
    returnData,     // req.body
    userId          // users.id
) => {

    // Get one database connection so every operation in this return uses the same transaction.
    const connection = await pool.getConnection();

    try {

        // Start the transaction.
        await connection.beginTransaction();

        // Find the original purchase we want to return.
        const purchase = await findPurchaseForReturn(
            connection,
            purchaseId     // purchases.id
        );

        // Stop if the purchase does not exist.
        if (!purchase) {
            throw new AppError(
                "Purchase not found",
                404
            );
        }

        // A cancelled purchase cannot be returned.
        if (purchase.status === "CANCELLED") {
            throw new AppError(
                "Cancelled purchase cannot be returned",
                400
            );
        }

        // Create the return record.
        const purchaseReturnId = await createPurchaseReturn(
            connection,
            {
                purchase_id: purchaseId,      // purchases.id → purchase_returns.purchase_id (FK)
                user_id: userId,               // users.id → purchase_returns.user_id (FK)
                reason: returnData.reason      // req.body.reason → purchase_returns.reason
            }
        );

        // Loop through every product being returned.
        for (const item of returnData.items) {

            // Check whether this product was part of the original purchase.
            const purchaseItem = await findPurchaseItemForReturn(
                connection,
                purchaseId,             // purchases.id
                item.product_id         // products.id
            );

            // Stop if the product was not part
            // of the original purchase.
            if (!purchaseItem) {
                throw new AppError(
                    "Product was not part of the original purchase",
                    404
                );
            }

            // Make sure we are not returning more
            // than the originally purchased quantity.
            if (item.quantity > purchaseItem.quantity) {
                throw new AppError(
                    "Cannot return more than the original quantity",
                    400
                );
            }

            // Find the current product stock.
            const product = await findProductForUpdate(
                connection,
                item.product_id     // products.id
            );

            // Stop if the product no longer exists.
            if (!product) {
                throw new AppError(
                    "Product not found",
                    404
                );
            }

            // Make sure we have enough stock to remove.
            if (product.stock < item.quantity) {
                throw new AppError(
                    "Insufficient stock for return",
                    400
                );
            }

            // Store the stock before the return.
            const previousStock = product.stock;    // products.stock before update

            // Calculate the stock after the return.
            const newStock = product.stock - item.quantity;

            // Decrease the actual product stock.
            await decreaseProductStock(
                connection,
                item.product_id,     // products.id
                item.quantity        // req.body.items[].quantity
            );

            // Record the returned product.
            await createPurchaseReturnItem(
                connection,
                {
                    purchase_return_id: purchaseReturnId,  // purchase_returns.id → FK
                    product_id: item.product_id,            // products.id → FK
                    quantity: item.quantity                 // req.body.items[].quantity
                }
            );

            // Record the inventory movement.
            await createInventoryLog(
                connection,
                {
                    productId: item.product_id,          // products.id
                    userId,                               // users.id
                    quantity: item.quantity,              // purchase_return_items.quantity
                    previousStock,                        // products.stock before update
                    newStock,                             // products.stock after update

                    movementType: "RETURN",               // inventory_logs.movement_type
                    referenceType: "PURCHASE_RETURN",     // purchase_returns
                    referenceId: purchaseReturnId,        // purchase_returns.id

                    remarks: "Stock removed from purchase return"
                }
            );
        }

        // Everything succeeded, so permanently save the transaction.
        await connection.commit();

        return {
            id: purchaseReturnId,       // purchase_returns.id
            purchase_id: purchaseId,    // purchases.id
            status: "RETURNED"
        };

    } catch (error) {

        // Something failed, so undo everything
        // that happened during this transaction.
        await connection.rollback();

        throw error;

    } finally {

        // Release the connection back to the pool.
        connection.release();
    }
};

module.exports = createPurchaseReturnService;