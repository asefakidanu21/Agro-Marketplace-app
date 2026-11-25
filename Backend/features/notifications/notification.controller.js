
import * as NotificationService from "./notification.service.js";

// Get notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getMyNotifications(
      req.user.id
    );

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Mark as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const removeNotification = async (req, res, next) => {
  try {
    const notification = await NotificationService.removeNotification(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Notification deleted",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
