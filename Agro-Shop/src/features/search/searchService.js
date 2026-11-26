


import api from "../../api/api";

export const searchProducts = async (filters = {}) => {
  const response = await api.get("/search", {
    params: filters,
  });

  return response.data.data;
};
