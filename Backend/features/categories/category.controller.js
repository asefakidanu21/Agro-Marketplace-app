
import * as categoryService from "./category.service.js";

const handleError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Internal server error",
  });
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
