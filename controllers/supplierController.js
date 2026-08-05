const asyncHandler = require("../utils/asyncHandler");

const {
    createSupplierService,
    getAllSuppliersService,
    getSupplierByIdService,
    updateSupplierService,
    deleteSupplierService
} = require("../services/supplierService");

const createSupplier = asyncHandler(async(req, res) => {
    const supplier = await createSupplierService(req.body);

    res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        data: supplier
    });
});

const getAllSuppliers = asyncHandler(async(req, res) => {
    const suppliers = await getAllSuppliersService();

    res.status(200).json({
        success: true,
        count: suppliers.length,
        data: suppliers
    })
});

const getSupplierById = asyncHandler(async(req, res) => {
    const supplier = await getSupplierByIdService(req.params.id);    

    res.status(200).json({
        success: true,
        data: supplier
    })
});

const updateSupplier = asyncHandler(async(req, res) => {
    const supplier = await updateSupplierService(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "Supplier updated successfully",
        data: supplier
    });
});

const deleteSupplier = asyncHandler(async(req, res) => {
    await deleteSupplierService(req.params.id);

    res.status(200).json({
        success: true,
        message: "Supplier deleted successfully"
    });
});

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
