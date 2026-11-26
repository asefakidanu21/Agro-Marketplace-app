


import api from "../../api/api";

// Get buyer's favorites
export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data.data;
};

// Add product to favorites
export const addFavorite = async (productId) => {
  const response = await api.post("/favorites", {
    product_id: productId,
  });

  return response.data.data;
};

// Remove product from favorites
export const removeFavorite = async (productId) => {
  const response = await api.delete(`/favorites/${productId}`);
  return response.data.data;
};
