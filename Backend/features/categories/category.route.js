
import { Router } from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = Router();

// Public: Get all categories
router.get("/", getAllCategories);

// Public: Get one category
router.get("/:id", getCategoryById);

// Admin only: Create category
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  createCategory
);

// Admin only: Update category
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  updateCategory
);

// Admin only: Delete category
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteCategory
);

export default router;
