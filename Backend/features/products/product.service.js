
import * as ProductModel from "./product.model.js";
import { getCategoryById } from "../categories/category.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Check product ID
const validateId = (id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    throw createError("Invalid product ID", 400);
  }
};

// Check category exists
const validateCategory = async (categoryId) => {
  if (categoryId === null || categoryId === undefined || categoryId === "") {
    return null;
  }

  return await getCategoryById(categoryId);
};

// Check that the product belongs to this farmer
const checkProductOwner = async (productId, farmerId) => {
  validateId(productId);

  const product = await ProductModel.findProductById(productId);

  if (!product) {
    throw createError("Product not found", 404);
  }

  if (product.farmer_id !== farmerId) {
    throw createError("You cannot modify this product", 403);
  }

  return product;
};

// Create product
export const createProduct = async (farmerId, data) => {
  if (!data.name || !data.unit || data.price === undefined || data.quantity === undefined) {
    throw createError("Name, price, unit and quantity are required", 400);
  }

  const price = Number(data.price);
  const quantity = Number(data.quantity);

  if (!Number.isFinite(price) || price < 0) {
    throw createError("Price must be a valid non-negative number", 400);
  }

  if (!Number.isFinite(quantity) || quantity < 0) {
    throw createError("Quantity must be a valid non-negative number", 400);
  }

  await validateCategory(data.category_id);

  return await ProductModel.createProduct({
    farmer_id: farmerId,
    category_id: data.category_id || null,
    name: data.name,
    description: data.description || null,
    price,
    unit: data.unit,
    quantity,
    image_url: data.image_url || null,
  });
};

// Get all products
export const getAllProducts = async () => {
  return await ProductModel.findAllProducts();
};

// Get logged-in farmer's products
export const getMyProducts = async (farmerId) => {
  return await ProductModel.findMyProducts(farmerId);
};

// Get one product
export const getProductById = async (id) => {
  validateId(id);

  const product = await ProductModel.findProductById(id);

  if (!product) {
    throw createError("Product not found", 404);
  }

  return product;
};

// Update product
export const updateProduct = async (productId, farmerId, data) => {
  const product = await checkProductOwner(productId, farmerId);

  const name = data.name ?? product.name;
  const description = data.description ?? product.description;
  const price = data.price === undefined ? Number(product.price) : Number(data.price);
  const unit = data.unit ?? product.unit;
  const quantity = data.quantity === undefined ? Number(product.quantity) : Number(data.quantity);
  const categoryId = data.category_id === undefined
    ? product.category_id
    : data.category_id || null;
  const imageUrl = data.image_url ?? product.image_url;

  if (!name || !unit) {
    throw createError("Name and unit are required", 400);
  }

  if (!Number.isFinite(price) || price < 0) {
    throw createError("Price must be a valid non-negative number", 400);
  }

  if (!Number.isFinite(quantity) || quantity < 0) {
    throw createError("Quantity must be a valid non-negative number", 400);
  }

  await validateCategory(categoryId);

  return await ProductModel.updateProduct(productId, {
    category_id: categoryId,
    name,
    description,
    price,
    unit,
    quantity,
    image_url: imageUrl,
  });
};

// Change product availability
export const changeProductStatus = async (productId, farmerId, status) => {
  await checkProductOwner(productId, farmerId);

  if (!["available", "unavailable"].includes(status)) {
    throw createError("Invalid product status", 400);
  }

  return await ProductModel.updateProductStatus(productId, status);
};

// Delete product
export const deleteProduct = async (productId, farmerId) => {
  await checkProductOwner(productId, farmerId);

  try {
    return await ProductModel.deleteProduct(productId);
  } catch (error) {
    if (error.code === "23503") {
      throw createError("This product is already in a cart and cannot be deleted", 409);
    }

    throw error;
  }
};

// Reduce product stock
export const reduceStock = async (productId, quantity) => {
  const product = await ProductModel.reduceProductStock(productId, quantity);

  if (!product) {
    throw createError("Product unavailable or insufficient stock", 400);
  }
};

// Restore product stock
export const restoreStock = async (productId, quantity) => {
  return await ProductModel.restoreProductStock(productId, quantity);
};
