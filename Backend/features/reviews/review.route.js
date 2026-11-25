

import express from "express";

import * as ReviewController from "./review.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

// Public: get reviews for a product
router.get("/product/:productId", ReviewController.getProductReviews);

// Authenticated: get my reviews
router.get("/my-reviews", authenticate, ReviewController.getMyReviews);

// Authenticated: create a review for a purchased product
router.post("/", authenticate, ReviewController.addReview);

// Authenticated: update own review
router.put("/:id", authenticate, ReviewController.editReview);

// Admin: delete any review
router.delete(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  ReviewController.adminRemoveReview
);

// Authenticated: delete own review
router.delete("/:id", authenticate, ReviewController.removeReview);

export default router;