


import * as SearchModel from "./search.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const searchProducts = async (filters) => {
  const minPrice = filters.min_price;
  const maxPrice = filters.max_price;

  if (minPrice !== undefined && (
    minPrice === "" || !Number.isFinite(Number(minPrice)) || Number(minPrice) < 0
  )) {
    throw createError("Invalid minimum price", 400);
  }

  if (maxPrice !== undefined && (
    maxPrice === "" || !Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0
  )) {
    throw createError("Invalid maximum price", 400);
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    throw createError("Minimum price cannot exceed maximum price", 400);
  }

  const categoryId = filters.category_id
    ? Number(filters.category_id)
    : null;

  if (filters.category_id && (!Number.isInteger(categoryId) || categoryId < 1)) {
    throw createError("Invalid category ID", 400);
  }

  return await SearchModel.searchProducts({
    name: filters.name?.trim() || null,
    category_id: categoryId,
    min_price: minPrice === undefined ? null : Number(minPrice),
    max_price: maxPrice === undefined ? null : Number(maxPrice),
  });
};
