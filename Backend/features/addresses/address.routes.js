
import express from "express";
import {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  makeDefaultAddress,
  removeAddress,
} from "./address.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireRole("buyer", "farmer"));

router.post("/", createAddress);
router.get("/", getMyAddresses);
router.get("/:id", getAddressById);
router.put("/:id", updateAddress);
router.patch("/:id/default", makeDefaultAddress);
router.delete("/:id", removeAddress);

export default router;
