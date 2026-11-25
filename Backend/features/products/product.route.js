
import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  changeProductStatus,
  deleteProduct,
} from "./product.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Farmer-only routes
router.post(
  "/",
  requireAuth,
  requireRole("farmer"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  requireAuth,
  requireRole("farmer"),
  upload.single("image"),
  updateProduct
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("farmer"),
  changeProductStatus
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("farmer"),
  deleteProduct
);

export default router;
