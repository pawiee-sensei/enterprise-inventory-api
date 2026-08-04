const {
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    createCategory
} = require('../models/categoryModel');

const createCategoryService = async (categoryData) => {
    // Check if category name already exists
    const existingCategory = await findCategoryByName(categoryData.name);

    // If it exists, throw an error
    if (existingCategory) {
        throw new Error('Category name already exists');
    }

    // If it doesn't exist, create the category
    const categoryId = await createCategory(categoryData);

    return {
        id: categoryId,
        name: categoryData.name
    };
};

const getAllCategoriesService = async () => {
    const categories = await findAllCategories();

    return categories;
};

const getCategoryByIdService = async (id) => {
    const category = await findCategoryById(id);

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
}

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService
};