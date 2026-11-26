
import api from "../../api/api";

// Get buyer's addresses
export const getMyAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data.data;
};

// Create address
export const createAddress = async (data) => {
  const response = await api.post("/addresses", data);
  return response.data.data;
};

// Delete address
export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

// Set default address
export const setDefaultAddress = async (id) => {
  const response = await api.patch(`/addresses/${id}/default`);
  return response.data.data;
};
