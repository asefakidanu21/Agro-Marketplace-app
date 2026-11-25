

import api from "../../api/api";

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data.data;
};