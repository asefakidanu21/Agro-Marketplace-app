import api from "../../api/api";

// Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

// Get one product
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

// Get farmer's products
export const getMyProducts = async (farmerId) => {
  const response = await api.get("/products", {
    params: { farmer_id: farmerId },
  });
  return response.data.data;
};

// Add product
export const addProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};