const pool = require("../database/db");

const { findReturnedQuantitiesBySaleId } = require("../models/saleReturnModel");

const {
    createSale,
    createSaleItem,
    findAllSales,
    findSaleById,
    findSaleItems,
    findTopSellingProducts,
    countSales
} = require("../models/saleModel");

const {
    findProductForUpdate,
    decreaseProductStock,
    createInventoryLog
} = require("../models/inventoryModel");

const AppError = require("../utils/AppError");

const createSaleService = async(
    saleData,
    userId
) => {

    const connection = await pool.getConnection();

    try{
        //start the transaction
        await connection.beginTransaction();

        let totalAmount = 0;

        //loop through the saleitems
        for(const item of saleData.items){
            
            //find the product and lock it
            const product = await findProductForUpdate(
                connection,
                item.product_id //items.product_id = products.id
            );

            //if the product does not exist throw an error
            if(!product){
                throw new AppError("Product not found", 404);
            }
        
        
            //if the stock is less than the quantity throw an error
            if(product.stock < item.quantity){
                throw new AppError("Not enough stock", 400);
            }

        // Calculate subtotal using the product's current selling price * quantity.
        const subtotal = item.quantity * product.selling_price;
            // Add this item's subtotal to the total amount.
            totalAmount += subtotal;
        }

        //Step 1: Create the main sale record
        const saleId = await createSale(
            connection,
            {
                user_id: userId, // users.id
                total_amount: totalAmount // sales.total_amount
            }
        );

        //loop through the sale items again
        for(const item of saleData.items){

            //Get the product again
            const product = await findProductForUpdate(
                connection,
                item.product_id //products.id
            );

            //get the unit price from the product
            const unitPrice = product.selling_price;

            //Calculate the subtotal using the product's current selling price * quantity
            const subtotal = item.quantity * unitPrice;

            
            //Step 2: Create the sale Item.
            await createSaleItem (
                connection,
                {
                    sale_id: saleId, // sales.id → sale_items.sale_id
                    product_id: item.product_id,  // products.id
                    quantity: item.quantity, // req.body.items[].quantity
                    unit_price: unitPrice, // products.selling_price
                    subtotal
                }
            );

            //Remember the previous stock
            const previousStock = product.stock;

            //Calculate the stock after the sale.
            const newStock = product.stock - item.quantity;
            
            //Step 3: Decrease the product stock
            await decreaseProductStock(
                connection,
                item.product_id, // products.id
                item.quantity    // sale_items.quantity
            );

            //Step 4: Create the inventory log
            await createInventoryLog(
                connection,
                {
                    productId: item.product_id, // products.id
                    userId,                      // users.id
                    quantity: item.quantity,     // sale_items.quantity
                    previousStock,               // products.stock before sale
                    newStock,                    // products.stock after sale

                    movementType: "SALE",
                    referenceType: "SALE",
                    referenceId: saleId,

                    remarks: "Stock removed from sale"
                }
            );
        }

        await connection.commit();

        return{
            id: saleId,
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

const getAllSalesService = async ({ page, limit } = {}) => {
    if (!page && !limit) {
        const sales = await findAllSales();
        return { sales, pagination: null };
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const [sales, total] = await Promise.all([
        findAllSales({ limit: limitNum, offset }),
        countSales(),
    ]);

    return {
        sales,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const getSaleByIdService = async (id) => {
    const sale = await findSaleById(id);

    if (!sale) {
        throw new AppError("Sale not found", 404);
    }

    const items = await findSaleItems(id);
    const returnedQuantities = await findReturnedQuantitiesBySaleId(id);

    const itemsWithReturns = items.map((item) => {
        const match = returnedQuantities.find((r) => r.product_id === item.product_id);
        return {
            ...item,
            returned_quantity: match ? match.returned_quantity : 0,
        };
    });

    return { ...sale, items: itemsWithReturns };
};

const getTopSellingProductsService = async (limit = 5) => {
    return await findTopSellingProducts(limit);
};

module.exports = {
    createSaleService,
    getAllSalesService,
    getSaleByIdService,
    getTopSellingProductsService
};
