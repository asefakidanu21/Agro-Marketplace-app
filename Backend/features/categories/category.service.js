
import * as categoryModel from "./category.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Validate category ID
const validateId = (id) => {
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw createError("Invalid category ID", 400);
  }

  return categoryId;
};

// Validate and prepare category data
const prepareCategoryData = (data, existingCategory = null) => {
  const name = data.name ?? existingCategory?.name;

  if (typeof name !== "string" || !name.trim()) {
    throw createError("Category name is required", 400);
  }

  const description =
    data.description !== undefined
      ? data.description
      : existingCategory?.description ?? null;

  const image_url =
    data.image_url !== undefined
      ? data.image_url
      : existingCategory?.image_url ?? null;

  const parent_id =
    data.parent_id !== undefined
      ? data.parent_id
      : existingCategory?.parent_id ?? null;

  if (
    description !== null &&
    typeof description !== "string"
  ) {
    throw createError("Description must be text", 400);
  }

  if (
    image_url !== null &&
    typeof image_url !== "string"
  ) {
    throw createError("Image URL must be text", 400);
  }

  let parentId = null;

  if (parent_id !== null && parent_id !== "") {
    parentId = Number(parent_id);

    if (!Number.isInteger(parentId) || parentId <= 0) {
      throw createError("Invalid parent category ID", 400);
    }
  }

  return {
    name: name.trim(),
    description: description?.trim() || null,
    image_url: image_url?.trim() || null,
    parent_id: parentId,
  };
};

// Check parent category and prevent circular hierarchy
const validateParent = async (categoryId, parentId) => {
  if (parentId === null) return;

  if (categoryId && categoryId === parentId) {
    throw createError("A category cannot be its own parent", 400);
  }

  const parentCategory = await categoryModel.findCategoryById(parentId);

  if (!parentCategory) {
    throw createError("Parent category not found", 404);
  }

  if (categoryId) {
    const descendants =
      await categoryModel.findDescendantCategoryIds(categoryId);

    const isDescendant = descendants.some(
      (category) => Number(category.id) === parentId
    );

    if (isDescendant) {
      throw createError(
        "Cannot assign a descendant as the parent category",
        400
      );
    }
  }
};

// Create category
export const createCategory = async (data) => {
  const categoryData = prepareCategoryData(data);

  const existingCategory = await categoryModel.findCategoryByName(
    categoryData.name
  );

  if (existingCategory) {
    throw createError("Category name already exists", 409);
  }

  await validateParent(null, categoryData.parent_id);

  try {
    return await categoryModel.createCategory(categoryData);
  } catch (error) {
    if (error.code === "23505") {
      throw createError("Category name already exists", 409);
    }

    if (error.code === "23503") {
      throw createError("Invalid parent category", 400);
    }

    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  return await categoryModel.findAllCategories();
};

// Get category by ID
export const getCategoryById = async (id) => {
  const categoryId = validateId(id);

  const category = await categoryModel.findCategoryById(categoryId);

  if (!category) {
    throw createError("Category not found", 404);
  }

  return category;
};

// Update category
export const updateCategory = async (id, data) => {
  const categoryId = validateId(id);

  const existingCategory = await categoryModel.findCategoryById(categoryId);

  if (!existingCategory) {
    throw createError("Category not found", 404);
  }

  const allowedFields = ["name", "description", "parent_id", "image_url"];

  const hasChanges = allowedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(data, field)
  );

  if (!hasChanges) {
    throw createError("No category fields provided", 400);
  }

  const categoryData = prepareCategoryData(data, existingCategory);

  const duplicateCategory = await categoryModel.findCategoryByName(
    categoryData.name
  );

  if (duplicateCategory && Number(duplicateCategory.id) !== categoryId) {
    throw createError("Category name already exists", 409);
  }

  await validateParent(categoryId, categoryData.parent_id);

  try {
    return await categoryModel.updateCategory(categoryId, categoryData);
  } catch (error) {
    if (error.code === "23505") {
      throw createError("Category name already exists", 409);
    }

    if (error.code === "23503") {
      throw createError("Invalid parent category", 400);
    }

    throw error;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  const categoryId = validateId(id);

  const category = await categoryModel.deleteCategory(categoryId);

  if (!category) {
    throw createError("Category not found", 404);
  }

  return category;
};
