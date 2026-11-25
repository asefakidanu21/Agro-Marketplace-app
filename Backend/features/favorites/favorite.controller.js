


import * as FavoriteService from "./favorite.service.js";

// Add favorite
export const addFavorite = async (req, res, next) => {
  try {
    const favorite = await FavoriteService.addFavorite(
      req.user.id,
      req.body.product_id
    );

    res.status(201).json({
      success: true,
      message: "Product added to favorites",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

// Get favorites
export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await FavoriteService.getMyFavorites(req.user.id);

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

// Remove favorite
export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await FavoriteService.removeFavorite(
      req.user.id,
      req.params.productId
    );

    res.json({
      success: true,
      message: "Product removed from favorites",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};
