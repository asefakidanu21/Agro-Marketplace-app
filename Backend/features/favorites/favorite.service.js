


import * as FavoriteModel from "./favorite.model.js";
import * as ProductService from "../products/product.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Add favorite
export const addFavorite = async (buyerId, productId) => {
  productId = Number(productId);

  if (!productId || productId < 1) {
    throw createError("Invalid product ID", 400);
  }

  const product = await ProductService.getProductById(productId);

  if (!product) {
    throw createError("Product not found", 404);
  }

  const existing = await FavoriteModel.findFavorite(
    buyerId,
    productId
  );

  if (existing) {
    throw createError("Product already in favorites", 409);
  }

  return await FavoriteModel.addFavorite(buyerId, productId);
};

// Get favorites
export const getMyFavorites = async (buyerId) => {
  return await FavoriteModel.findFavorites(buyerId);
};

// Remove favorite
export const removeFavorite = async (buyerId, productId) => {
  const favorite = await FavoriteModel.removeFavorite(
    buyerId,
    Number(productId)
  );

  if (!favorite) {
    throw createError("Favorite not found", 404);
  }

  return favorite;
};
