
import { Router } from "express";

import {
  register,
  login,
  getMe,
} from "./auth.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();

// Create a farmer or buyer account
router.post("/register", register);

// Login
router.post("/login", login);

// Get current authenticated user's profile
router.get("/me", requireAuth, getMe);

export default router;
