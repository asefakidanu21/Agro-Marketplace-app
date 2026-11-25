



import * as HomeModel from "./home.model.js";

// Get home screen data
export const getHomeData = async () => {
  const categories = await HomeModel.findHomeCategories();
  const latestProducts = await HomeModel.findLatestProducts();
  const popularProducts = await HomeModel.findPopularProducts();

  return {
    categories,
    latestProducts,
    popularProducts,
  };
};
