const {
    findSupplierById,
    findSupplierByName,
    findSupplierByEmail,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    findAllSuppliers
} = require('../models/supplierModel');

const AppError = require('../utils/AppError');

const  createSupplierService = async (supplierData) => {

    // Check if supplier name already exists
    const existingSupplier = await findSupplierByName(supplierData.name);

    // If it exists, throw an error
    if (existingSupplier) {
        throw new AppError('Supplier name already exists', 409);
    }

    //Check duplicate Email only if email is provided
    if(supplierData.email) {
        const existingEmail = await findSupplierByEmail(supplierData.email);

        // If it exists, throw an error
        if (existingEmail) {
            throw new AppError('Supplier email already exists', 409);
        }
    }

    // Create the supplier
    const supplierId = await createSupplier(supplierData);

    // Return the supplier
    return {
        id: supplierId,
        name: supplierData.name
    };
};

// Get all suppliers
const getAllSuppliersService = async () => {

    // Get all suppliers
    const suppliers = await findAllSuppliers();
    // Return all suppliers
    return suppliers;
};

// Get supplier by id
const getSupplierByIdService = async (id) => {

    // Validate if supplier exists
    const supplier = await findSupplierById(id);

    // If it doesn't exist, throw an error
    if (!supplier) {
        throw new AppError('Supplier not found', 404);
    }
    // Return the supplier
    return supplier;
};

const updateSupplierService = async (id, supplierData) => {

    // Validate if supplier exists
    const supplier = await findSupplierById(id);

    // If it doesn't exist, throw an error
    if (!supplier) {
        throw new AppError('Supplier not found', 404);
    }

    // Check if supplier name already exists
    const existingSupplier = await findSupplierByName(supplierData.name);

    // If it exists, throw an error
    if (existingSupplier && existingSupplier.id !== Number(id)) {
        throw new AppError('Supplier name already exists', 409);
    }

    //Check duplicate Email only if email is provided
    if(supplierData.email) {
        const existingEmail = await findSupplierByEmail(supplierData.email);

        // If it exists, throw an error
        if (existingEmail && existingEmail.id !== Number(id)) {
            throw new AppError('Supplier email already exists', 409);
        }
    }

    // Update the supplier
    await updateSupplier(id, supplierData);

    // Return the supplier
    return {
        id: id,
        name: supplierData.name
    };
};

const deleteSupplierService = async (id) => {

    // Validate if supplier exists
    const supplier = await findSupplierById(id);

    // If it doesn't exist, throw an error
    if (!supplier) {
        throw new AppError('Supplier not found', 404);
    }

    // Delete the supplier
    await deleteSupplier(id);

    return;
};

module.exports = {
    createSupplierService,
    getAllSuppliersService,
    getSupplierByIdService,
    updateSupplierService,
    deleteSupplierService
};