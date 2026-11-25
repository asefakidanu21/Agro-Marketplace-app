
import sql from "../../config/database.js";

// Create notification
export const createNotification = async (data) => {
  const [notification] = await sql`
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_order_id
    )
    VALUES (
      ${data.user_id},
      ${data.title},
      ${data.message},
      ${data.type},
      ${data.related_order_id}
    )
    RETURNING *
  `;

  return notification;
};

// Get user's notifications
export const findUserNotifications = async (userId) => {
  return await sql`
    SELECT *
    FROM notifications
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
};

// Mark notification as read
export const markNotificationAsRead = async (id, userId) => {
  const [notification] = await sql`
    UPDATE notifications
    SET is_read = true
    WHERE id = ${id}
      AND user_id = ${userId}
    RETURNING *
  `;

  return notification;
};

// Delete notification
export const deleteNotification = async (id, userId) => {
  const [notification] = await sql`
    DELETE FROM notifications
    WHERE id = ${id}
      AND user_id = ${userId}
    RETURNING *
  `;

  return notification;
};
