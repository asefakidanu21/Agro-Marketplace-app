


import api from "../../api/api";

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

// Change order status
export const changeOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data.data;
};
