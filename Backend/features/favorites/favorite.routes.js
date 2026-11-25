


import express from "express";

import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "./favorite.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireRole("buyer"));

router.post("/", addFavorite);
router.get("/", getMyFavorites);
router.delete("/:productId", removeFavorite);

export default router;
