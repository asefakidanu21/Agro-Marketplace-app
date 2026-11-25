
import api from "../../api/api";

// Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

// Get logged-in farmer's products
export const getMyProducts = async () => {
  const response = await api.get("/products/my-products");
  return response.data.data;
};

// Get one product
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

// Create FormData for adding and editing products
const createProductFormData = (data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("category_id", data.category_id || "");
  formData.append("description", data.description || "");
  formData.append("price", String(data.price));
  formData.append("unit", data.unit);
  formData.append("quantity", String(data.quantity));

  if (data.image) {
    formData.append("image", {
      uri: data.image.uri,
      name: data.image.fileName || "product.jpg",
      type: data.image.mimeType || "image/jpeg",
    });
  }

  return formData;
};

// Add product
export const addProduct = async (data) => {
  const formData = createProductFormData(data);

  const response = await api.post("/products", formData);
  return response.data.data;
};

// Update product
export const updateProduct = async (id, data) => {
  const formData = createProductFormData(data);

  const response = await api.put(`/products/${id}`, formData);
  return response.data.data;
};

// Change product status
export const changeProductStatus = async (id, status) => {
  const response = await api.patch(`/products/${id}/status`, {
    status,
  });

  return response.data.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
