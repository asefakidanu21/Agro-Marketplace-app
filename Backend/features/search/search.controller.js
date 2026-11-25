


import * as SearchService from "./search.service.js";

export const searchProducts = async (req, res, next) => {
  try {
    const products = await SearchService.searchProducts(req.query);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
