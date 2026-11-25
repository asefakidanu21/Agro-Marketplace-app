
import express from "express";
import {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderDetails,
  changeOrderStatus,
  cancelOrder,
} from "./order.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// Buyer routes
router.post("/", requireRole("buyer"), placeOrder);
router.get("/my-orders", requireRole("buyer"), getMyOrders);
router.patch("/:id/cancel", requireRole("buyer"), cancelOrder);

// Farmer routes
router.get("/farmer-orders", requireRole("farmer"), getFarmerOrders);
router.patch("/:id/status", requireRole("farmer"), changeOrderStatus);

// Buyer or farmer can view their own order
router.get("/:id", requireRole("buyer", "farmer"), getOrderDetails);

export default router;
