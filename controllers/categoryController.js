const asyncHandler = require("../utils/asyncHandler");

const {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService
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

    if(!category){
        res.status(404);
        throw new Error("Category not found");
    }

    res.status(200).json({
        success: true,
        data: category
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById
};