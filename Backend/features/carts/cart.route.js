import express from "express";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  emptyCart,
} from "./cart.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireRole("buyer"));

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:id", updateCartQuantity);
router.delete("/items/:id", removeFromCart);
router.delete("/", emptyCart);

export default router;