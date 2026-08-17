const asyncHandler = require("../utils/asyncHandler");

const {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    deleteCategoryService
} = require("../services/categoryService");

const createCategory = asyncHandler(async(req, res) => {
    const category = await createCategoryService(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
    });
});

const getAllCategories = asyncHandler(async(req, res) => {
    const categories = await getAllCategoriesService();

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    })
});

const getCategoryById = asyncHandler(async(req, res) => {
    const category = await getCategoryByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: category
    });
});

const deleteCategory = asyncHandler(async(req, res) => {
    await deleteCategoryService(req.params.id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory
};