
import api from "../../api/api";

// Get buyer's cart items
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data.data.items;
};

// Add product to cart
export const addToCart = async (product_id, quantity) => {
  const response = await api.post("/cart/items", {
    product_id,
    quantity,
  });

  return response.data.data;
};

// Update cart item quantity
export const updateCartItem = async (id, quantity) => {
  const response = await api.put(`/cart/items/${id}`, {
    quantity,
  });

  return response.data.data;
};

// Remove product from cart
export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/items/${id}`);
  return response.data;
};

// Empty cart
export const emptyCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};
