    const pool = require("../database/db");

    const {
        createPurchase,
        createPurchaseItem
    } = require ("../models/purchaseModel");

    const {
        findProductForUpdate,
        increaseProductStock,
        createInventoryLog
    } = require("../models/inventoryModel");

    const {
        findSupplierById
    } = require("../models/supplierModel");

    const AppError = require("../utils/AppError");

    const createPurchaseService = async (
        //req.body from purchase controller
        purchaseData,
        //from user id
        userId
    ) => {

        const connection = await pool.getConnection();

        try{

            await connection.beginTransaction();

            const supplier = await findSupplierById(purchaseData.supplier_id);

            if(!supplier){
                throw new AppError("Supplier not found", 404);
            }

        let totalAmount = 0;

        // Loop through the items and calculate the total amount
        for (const item of purchaseData.items) {
            // Get the unit_cost from the product and calculate the subtotal
            totalAmount += item.quantity * item.unit_cost;
        }


        const purchaseId = await createPurchase(
            connection,
            {
                supplier_id: purchaseData.supplier_id,
                user_id: userId,
                total_amount: totalAmount
            }
        );

        for (const item of purchaseData.items) {

            // Step 1: Validate the product exists
            const product = await findProductForUpdate(
                connection,
                item.product_id
            );
            // throw error if product not found
            if (!product) {
                throw new AppError("Product not found", 404);
            }

            // Step 2: calculate the subtotal
            const subtotal = item.quantity * item.unit_cost;

            // Step 3: Insert the purchase item
            await createPurchaseItem(
                connection,
                {
                    purchase_Id: purchaseId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_cost: item.unit_cost,
                    subtotal
                }
            );

            // Step 4: Update Product Stock

    const previousStock = product.stock;
    const newStock = previousStock + item.quantity;

    await increaseProductStock(
        connection,
        item.product_id,
        item.quantity
    );

    // Step 5: Create Inventory Log

    await createInventoryLog(
        connection,
        {
            productId: item.product_id,
            userId,
            quantity: item.quantity,
            previousStock,
            newStock,
            purchaseId,
            remarks: "Stock added from supplier purchase"
        }
    );
        }




        await connection.commit();

        return {
            id: purchaseId,
            supplier_id: purchaseData.supplier_id,
            total_amount: totalAmount,
            status: "COMPLETED"
        };
        

        } catch (error) {

            await connection.rollback();

            throw error;
        } finally {
            connection.release();
        }
    };

module.exports = createPurchaseService;

