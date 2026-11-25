

import * as ReviewModel from "./review.model.js";

const validateId = (id, name) => {
  const number = Number(id);

  if (!Number.isInteger(number) || number <= 0) {
    const error = new Error(`Invalid ${name}.`);
    error.statusCode = 400;
    throw error;
  }

  return number;
};

const validateReviewData = (rating, comment) => {
  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    const error = new Error("Rating must be an integer between 1 and 5.");
    error.statusCode = 400;
    throw error;
  }

  if (
    comment !== undefined &&
    comment !== null &&
    typeof comment !== "string"
  ) {
    const error = new Error("Comment must be a string.");
    error.statusCode = 400;
    throw error;
  }

  return {
    rating: numericRating,
    comment: comment?.trim() || null,
  };
};

// Create review
export const addReview = async (buyerId, data) => {
  const validBuyerId = validateId(buyerId, "buyer ID");
  const orderItemId = validateId(data.orderItemId, "order item ID");

  const reviewData = validateReviewData(data.rating, data.comment);

  const orderItem = await ReviewModel.findPurchasedOrderItem(
    orderItemId,
    validBuyerId
  );

  if (!orderItem) {
    const error = new Error(
      "You can only review products from your own orders."
    );
    error.statusCode = 403;
    throw error;
  }

  const existingReview = await ReviewModel.findReviewByBuyerAndProduct(
    validBuyerId,
    orderItem.product_id
  );

  if (existingReview) {
    const error = new Error("You have already reviewed this product.");
    error.statusCode = 409;
    throw error;
  }

  try {
    return await ReviewModel.createReview({
      buyerId: validBuyerId,
      productId: orderItem.product_id,
      orderItemId,
      ...reviewData,
    });
  } catch (error) {
    if (error.code === "23505") {
      const conflict = new Error("You have already reviewed this product.");
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
};

// Get product reviews
export const getProductReviews = async (productId) => {
  const validProductId = validateId(productId, "product ID");

  const reviews = await ReviewModel.findProductReviews(validProductId);
  const summary = await ReviewModel.getProductReviewSummary(validProductId);

  return {
    summary,
    reviews,
  };
};

// Get buyer's reviews
export const getMyReviews = async (buyerId) => {
  const validBuyerId = validateId(buyerId, "buyer ID");

  return await ReviewModel.findBuyerReviews(validBuyerId);
};

// Update own review
export const editReview = async (reviewId, buyerId, data) => {
  const validReviewId = validateId(reviewId, "review ID");
  const validBuyerId = validateId(buyerId, "buyer ID");

  const reviewData = validateReviewData(data.rating, data.comment);

  const existingReview = await ReviewModel.findReviewById(validReviewId);

  if (!existingReview) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    throw error;
  }

  if (Number(existingReview.buyer_id) !== validBuyerId) {
    const error = new Error("You cannot update another user's review.");
    error.statusCode = 403;
    throw error;
  }

  return await ReviewModel.updateReview(
    validReviewId,
    validBuyerId,
    reviewData
  );
};

// Delete own review
export const removeReview = async (reviewId, buyerId) => {
  const validReviewId = validateId(reviewId, "review ID");
  const validBuyerId = validateId(buyerId, "buyer ID");

  const existingReview = await ReviewModel.findReviewById(validReviewId);

  if (!existingReview) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    throw error;
  }

  if (Number(existingReview.buyer_id) !== validBuyerId) {
    const error = new Error("You cannot delete another user's review.");
    error.statusCode = 403;
    throw error;
  }

  return await ReviewModel.deleteReview(validReviewId, validBuyerId);
};

// Admin delete
export const removeReviewByAdmin = async (reviewId) => {
  const validReviewId = validateId(reviewId, "review ID");

  const review = await ReviewModel.adminDeleteReview(validReviewId);

  if (!review) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    throw error;
  }

  return review;
};