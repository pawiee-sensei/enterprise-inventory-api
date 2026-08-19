const {
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../models/categoryModel');

const AppError = require('../utils/AppError');

const createCategoryService = async (categoryData) => {
    // Check if category name already exists
    const existingCategory = await findCategoryByName(categoryData.name);

    // If it exists, throw an error
    if (existingCategory) {
        throw new AppError('Category name already exists', 409);
    }

    // If it doesn't exist, create the category
    const categoryId = await createCategory(categoryData);

    return {
        id: categoryId,
        name: categoryData.name
    };
};

const getAllCategoriesService = async () => {

    // Fetch all categories from the database
    const categories = await findAllCategories();

    return categories;
};

const getCategoryByIdService = async (id) => {

    // Fetch the category by ID from the database
    const category = await findCategoryById(id);

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    return category;
};

const updateCategoryService = async (id, categoryData) => {

    // Check the category exists first
    const category = await findCategoryById(id);

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // If renaming, make sure the new name isn't already taken by a different category
    if (categoryData.name && categoryData.name !== category.name) {
        const existingCategory = await findCategoryByName(categoryData.name);

        if (existingCategory) {
            throw new AppError('Category name already exists', 409);
        }
    }

    await updateCategory(id, categoryData);

    return {
        id,
        name: categoryData.name,
        description: categoryData.description
    };
};

const deleteCategoryService = async (id) => {

    // Delete the category by ID from the database
    const category = await findCategoryById(id);

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    await deleteCategory(id);

    return;
};

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
};