const pool = require("../database/db");

const {
    createSaleReturn,
    createSaleReturnItem,
    findSaleForReturn,
    findSaleItemForReturn,
    findReturnQuantity
} = require("../models/saleReturnModel");

const {
    findProductForUpdate,
    increaseProductStock,
    createInventoryLog
} = require("../models/inventoryModel");

const AppError = require("../utils/AppError");

const createSaleReturnService = async(
    saleId, // sales.id
    returnData, //req.body
    userId  //users.id
) => {

    //Get a database connection
    const connection = await pool.getConnection();

    try {

        //start the transaction
        await connection.beginTransaction();

        //Find the sale and lock it
        const sale = await findSaleForReturn(
            connection,
            saleId           // sales.id
        );

        //If the sale does not exist throw an error
        if(!sale) {
            throw new AppError("Sale not found", 404);
        }

        // If the sale is cancelled, it cannot be returned.
        if (sale.status === "CANCELLED") {
            throw new AppError("Cancelled sale cannot be returned",400);

        }

        //Create main sale return record 
        const saleReturnId = await createSaleReturn(
            connection,
            {
                sale_id: saleId,           // sales.id → sale_returns.sale_id
                user_id: userId,            // users.id → sale_returns.user_id
                reason: returnData.reason   // req.body.reason
            }
        );

        //loop through the items and create sale return items
        for(const item of returnData.items) {

            // Check whether this product was part of the original sale.
            const saleItem = await findSaleItemForReturn(
                connection,
                saleId,            // sales.id
                item.product_id     // products.id
            );

            //If the sale item does not exist throw an error
            if(!saleItem) {
                throw new AppError("Product not found in sale", 404);
            }

            // Find how much of this product was already returned.
            // saleId = sales.id
            // item.product_id = products.id
            const returnedQuantity = await findReturnQuantity(
                connection,
                saleId,             // sales.id
                item.product_id     // products.id
            );

            // Calculate how much can still be returned.
            //saleItem = sale_items
            // returnedQuantity = returned quantity from findReturnQuantity
            const remainingQuantity =
                saleItem.quantity - returnedQuantity;

            // Make sure the new return does not exceed
            // the remaining returnable quantity.
            if (item.quantity > remainingQuantity) {
                throw new AppError(
                    `Cannot return more than the remaining quantity (${remainingQuantity})`,
                    400
                );
            }
            //Find the product and lock it
            const product = await findProductForUpdate(
                connection,
                item.product_id  // products.id
            );

            //If the product does not exist throw an error
            if(!product) {
                throw new AppError("Product not found", 404);
            }

            //Save the product previous stock
            const previousStock = product.stock;

            //Calculate and Increase the product stock
            const newStock = previousStock + item.quantity;

            //Increase the product stock
            await increaseProductStock(
                connection,
                item.product_id, // products.id
                item.quantity    // sale_return_items.quantity
            );

            //Record the returned product
            await createSaleReturnItem(
                connection,
                {
                    sale_return_id: saleReturnId,  // sale_returns.id → sale_return_items.sale_return_id
                    product_id: item.product_id,    // products.id → sale_return_items.product_id
                    quantity: item.quantity         // sale_return_items.quantity
                }
            );

            //Record Inventory Movement Log
            await createInventoryLog(
                connection,
                {
                    productId: item.product_id,     // products.id
                    userId,                         // users.id
                    quantity: item.quantity,        // sale_return_items.quantity
                    previousStock,                  // products.stock before return
                    newStock,                       // products.stock after return

                    movementType: "RETURN",         // inventory_logs.movement_type
                    referenceType: "SALE_RETURN",   // inventory_logs.reference_type
                    referenceId: saleReturnId,      // sale_returns.id

                    remarks: returnData.reason      // req.body.reason
                }
            );
        }

        //Commit the transaction
        await connection.commit();

        return {
            id: saleReturnId,
            sale_id: saleId,
            status: "RETURNED"
        };
    
    } catch (error) {

        //Rollback the transaction
        await connection.rollback();

        throw error;
    } finally {

        //Release the connection
        connection.release();
    }
};

module.exports = {createSaleReturnService};