
import api from "../../api/api";

// Place buyer's order
export const placeOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data.data;
};

// Get buyer's orders
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data.data;
};

// Cancel buyer's order
export const cancelOrder = async (id) => {
  const response = await api.patch(`/orders/${id}/cancel`);
  return response.data.data;
};

// Get farmer's orders
export const getFarmerOrders = async () => {
  const response = await api.get("/orders/farmer-orders");
  return response.data.data;
};

// Get order details
export const getOrderDetails = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

// Change farmer's order status
export const changeOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data.data;
};
