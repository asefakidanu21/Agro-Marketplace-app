
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

// Convert product data into FormData
const createProductFormData = (productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("category_id", String(productData.category_id));
  formData.append("description", productData.description || "");
  formData.append("price", String(productData.price));
  formData.append("unit", productData.unit);
  formData.append("quantity", String(productData.quantity));

  if (productData.image) {
    if (productData.image.file) {
      formData.append("image", productData.image.file);
    } else {
      formData.append("image", {
        uri: productData.image.uri,
        name: productData.image.fileName || "product.jpg",
        type: productData.image.mimeType || "image/jpeg",
      });
    }
  }

  return formData;
};

// Add product
export const addProduct = async (productData) => {
  const formData = createProductFormData(productData);

  const response = await api.post("/products", formData);

  return response.data.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const formData = createProductFormData(productData);

  const response = await api.put(`/products/${id}`, formData);

  return response.data.data;
};

// Change product status
export const changeProductStatus = async (id, status) => {
  const response = await api.patch(`/products/${id}/status`, { status });

  return response.data.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
