    const pool = require("../database/db");

    const { findReturnedQuantitiesByPurchaseId } = require("../models/purchaseReturnModel");

    const {
        createPurchase,
        createPurchaseItem,
        findAllPurchases,
        findPurchaseById,
        findPurchaseItems,
        findProductsPurchasedFromSupplier,
        countPurchases
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

    // Create a new purchase
    const createPurchaseService = async (
        //Purchase data supplier/items = product_id/quantity/unit_cost
        purchaseData,
        //from user id
        userId
    ) => {
        
        // Get a database connection
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
            // Calculate the total amount of the purchase
            totalAmount += item.quantity * item.unit_cost;
        }

        // Step 1: Create the purchase
        const purchaseId = await createPurchase(
            connection,
            {
                supplier_id: purchaseData.supplier_id,
                user_id: userId,
                total_amount: totalAmount
            }
        );

        // Loop through the items = product_id/quantity/unit_cost
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
                    purchase_id: purchaseId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_cost: item.unit_cost,
                    subtotal
                }
            );

    // Step 4: Remember the previous stock
    const previousStock = product.stock;
    // Step 4: Previous stock + quantity
    const newStock = previousStock + item.quantity;
    
    // Step 4: Increase the product stock  on database
    await increaseProductStock(
        connection,
        item.product_id,
        item.quantity
    );

    // Step 5: Create Inventory Log
    await createInventoryLog(
        connection,
        {
            productId: item.product_id,       // products.id
            userId,                            // users.id
            quantity: item.quantity,           // purchase_items.quantity
            previousStock,                     // products.stock before update
            newStock,                          // products.stock after update
            movementType: "PURCHASE",          // inventory_logs.movement_type
            referenceType: "PURCHASE",         // purchases.id relationship
            referenceId: purchaseId,           // purchases.id
            remarks: "Stock added from supplier purchase"
        }
    );
        }

        // Commit the transaction/update the database
        await connection.commit();

        // Return the purchase data
        return {
            id: purchaseId,
            supplier_id: purchaseData.supplier_id,
            total_amount: totalAmount,
            status: "COMPLETED"
        };
        

        } catch (error) {

            // Rollback the transaction if transaction fails
            await connection.rollback();

            
            throw error;

            // Release the connection
        } finally {
            connection.release();
        }
    };

const getAllPurchasesService = async ({ page, limit } = {}) => {
    if (!page && !limit) {
        const purchase = await findAllPurchases();
        return { purchases, pagination: null };
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const [purchases, total] = await Promise.all([
        findAllPurchases({ limit: limitNum, offset }),
        countPurchases(),
    ]);

    return {
        purchases,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const getPurchaseByIdService = async (id) => {
    const purchase = await findPurchaseById(id);

    if (!purchase) {
        throw new AppError("Purchase not found", 404);
    }

    const items = await findPurchaseItems(id);
    const returnedQuantities = await findReturnedQuantitiesByPurchaseId(id);

    const itemsWithReturns = items.map((item) => {
        const match = returnedQuantities.find((r) => r.product_id === item.product_id);
        return {
            ...item,
            returned_quantity: match ? match.returned_quantity : 0,
        };
    });

    return { ...purchase, items: itemsWithReturns };
};

const getProductsPurchasedFromSupplierService = async (supplierId) => {
    const products = await findProductsPurchasedFromSupplier(supplierId);
    return products;
};

module.exports = {
    createPurchaseService,
    getAllPurchasesService,
    getPurchaseByIdService,
    getProductsPurchasedFromSupplierService
};

