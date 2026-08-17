const  pool = require("../database/db");

const {
    findProductForUpdate,
    increaseProductStock,
    decreaseProductStock,
    createInventoryLog
} = require("../models/inventoryModel");

const AppError = require("../utils/AppError");

const createInventoryAdjustment = async(
    adjustmentData,
    userId
) => {
    const connection = await pool.getConnection();

    try{
        //start the transaction
        await connection.beginTransaction();

        //find the product and lock it  
        const product = await findProductForUpdate(
            connection,
            adjustmentData.product_id
        );

        if(!product){
            throw new AppError("Product not found", 404);
        }

        const previousStock = product.stock;

        //determine the movement type if in or out
        if(adjustmentData.type === "ADJUSTMENT_IN"){
            //calculate the new stock
            const newStock = product.stock + adjustmentData.quantity;

            //update the product stock
            await increaseProductStock(
                connection,
                adjustmentData.product_id,
                adjustmentData.quantity
            );

            await createInventoryLog(
                connection,
                {
                    productId: adjustmentData.product_id,   // products.id
                    userId,                                 // users.id
                    quantity: adjustmentData.quantity,      // adjustment quantity
                    previousStock,                          // products.stock before adjustment
                    newStock,                               // products.stock after adjustment

                    movementType: "ADJUSTMENT_IN",          // inventory_logs.movement_type
                    referenceType: "MANUAL",                // inventory_logs.reference_type
                    referenceId: null,                      // no purchase/sale reference

                    remarks: adjustmentData.reason         // req.body.reason
                }
            );

        } else if (adjustmentData.type === "ADJUSTMENT_OUT"){

            //if the stock is less than the quantity throw an error
            if(product.stock < adjustmentData.quantity){
                throw new AppError("Insufficient stock", 400);
            }


        

        const newStock = previousStock - adjustmentData.quantity;

        await decreaseProductStock (
            connection,
            adjustmentData.product_id,
            adjustmentData.quantity
        );

        await createInventoryLog(
            connection,
            {
                productId: adjustmentData.product_id,   // products.id
                userId,                                 // users.id
                quantity: adjustmentData.quantity,      // adjustment quantity
                previousStock,                          // products.stock before adjustment
                newStock,                               // products.stock after adjustment

                movementType: "ADJUSTMENT_OUT",         // inventory_logs.movement_type
                referenceType: "MANUAL",                // inventory_logs.reference_type
                referenceId: null,                      // no purchase/sale reference

                remarks: adjustmentData.reason         // req.body.reason
            }
        );
    } else {
        throw new AppError("Invalid adjustment type", 400);
    }

    await connection.commit();

    return {
        product_id: adjustmentData.product_id,
        adjustment_type: adjustmentData.type,
        quantity: adjustmentData.quantity,
        previous_stock: previousStock,
    };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { createInventoryAdjustment };