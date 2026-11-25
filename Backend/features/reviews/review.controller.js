

import * as ReviewService from "./review.service.js";

export const addReview = async (req, res) => {
  try {
    const review = await ReviewService.addReview(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      data: review,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const result = await ReviewService.getProductReviews(
      req.params.productId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await ReviewService.getMyReviews(req.user.id);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editReview = async (req, res) => {
  try {
    const review = await ReviewService.editReview(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeReview = async (req, res) => {
  try {
    const review = await ReviewService.removeReview(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
      data: review,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminRemoveReview = async (req, res) => {
  try {
    const review = await ReviewService.removeReviewByAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully by admin.",
      data: review,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};