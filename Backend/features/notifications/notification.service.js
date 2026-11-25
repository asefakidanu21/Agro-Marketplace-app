
import * as NotificationModel from "./notification.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create notification
export const createNotification = async (data) => {
  if (!data.user_id || !data.title || !data.message) {
    throw createError("User, title and message are required", 400);
  }

  return await NotificationModel.createNotification({
    user_id: data.user_id,
    title: data.title,
    message: data.message,
    type: data.type || "general",
    related_order_id: data.related_order_id || null,
  });
};

// Get user's notifications
export const getMyNotifications = async (userId) => {
  return await NotificationModel.findUserNotifications(userId);
};

// Mark as read
export const markAsRead = async (id, userId) => {
  const notification = await NotificationModel.markNotificationAsRead(
    Number(id),
    userId
  );

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  return notification;
};

// Delete notification
export const removeNotification = async (id, userId) => {
  const notification = await NotificationModel.deleteNotification(
    Number(id),
    userId
  );

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  return notification;
};
