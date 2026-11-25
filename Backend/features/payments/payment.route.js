
import express from "express";

import {
  createPayment,
  getOrderPayments,
  confirmPayment,
} from "./payment.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// Buyer routes
router.post("/", requireRole("buyer"), createPayment);
router.get("/order/:orderId", requireRole("buyer"), getOrderPayments);

// Admin confirms payment
router.patch("/:id/confirm", requireRole("admin"), confirmPayment);

export default router;
