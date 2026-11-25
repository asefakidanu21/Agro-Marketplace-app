
import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changeUserStatus,
} from "./user.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = Router();

// All users endpoints require authentication
router.use(requireAuth);

// GET /api/users
// Admin only
router.get(
  "/",
  requireRole("admin"),
  getAllUsers
);

// GET /api/users/:id
// Owner or admin
router.get(
  "/:id",
  getUserById
);

// PUT /api/users/:id
// Owner or admin
router.put(
  "/:id",
  updateUserProfile
);

// PATCH /api/users/:id/status
// Admin only
router.patch(
  "/:id/status",
  requireRole("admin"),
  changeUserStatus
);

export default router;
