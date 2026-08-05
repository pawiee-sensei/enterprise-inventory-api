const {
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    createCategory
} = require('../models/categoryModel');

const AppError = require('../utils/AppError');

const createCategoryService = async (categoryData) => {
    // Check if category name already exists
    const existingCategory = await findCategoryByName(categoryData.name);

    // If it exists, throw an error
    if (existingCategory) {
        throw new AppError('Category name already exists', 400);
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
}

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService
};