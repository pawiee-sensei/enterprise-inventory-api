const asyncHandler = require("../utils/asyncHandler");

const {
    createPurchaseService,
    getAllPurchasesService,
    getPurchaseByIdService
} = require("../services/purchaseService");
const { get } = require("../routes/productRoutes");

const createPurchase = asyncHandler(async(req, res) => {
    const purchase =  await createPurchaseService(req.body, req.user.id);

    res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        data: purchase
    });
});

const getAllPurchases = asyncHandler(async(req, res) => {
    const purchases = await getAllPurchasesService();

    res.status(200).json({
        success: true,
        count: purchases.length,
        data: purchases
    })
});

const getPurchaseById = asyncHandler(async(req, res) => {
    const purchase = await getPurchaseByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: purchase
        
    });
});


module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById
};