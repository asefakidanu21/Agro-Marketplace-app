
import express from "express";

import {
  getMyNotifications,
  markAsRead,
  removeNotification,
} from "./notification.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", removeNotification);

export default router;
