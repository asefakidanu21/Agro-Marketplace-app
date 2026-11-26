


import api from "../../api/api";

// Get user's notifications
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data.data;
};

// Mark notification as read
export const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

// Delete notification
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data.data;
};
