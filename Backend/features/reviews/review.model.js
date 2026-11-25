

import sql from "../../config/database.js";

// Find an order item belonging to the current buyer
export const findPurchasedOrderItem = async (orderItemId, buyerId) => {
  const result = await sql`
    SELECT
      oi.id,
      oi.product_id,
      oi.product_name,
      o.buyer_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.id = ${orderItemId}
      AND o.buyer_id = ${buyerId}
  `;

  return result[0];
};

// Check whether the buyer has already reviewed this product
export const findReviewByBuyerAndProduct = async (buyerId, productId) => {
  const result = await sql`
    SELECT *
    FROM reviews
    WHERE buyer_id = ${buyerId}
      AND product_id = ${productId}
  `;

  return result[0];
};

// Create a review
export const createReview = async (data) => {
  const result = await sql`
    INSERT INTO reviews (
      buyer_id,
      product_id,
      order_item_id,
      rating,
      comment
    )
    VALUES (
      ${data.buyerId},
      ${data.productId},
      ${data.orderItemId},
      ${data.rating},
      ${data.comment}
    )
    RETURNING *
  `;

  return result[0];
};

// Get all reviews for a product
export const findProductReviews = async (productId) => {
  return await sql`
    SELECT
      r.id,
      r.buyer_id,
      r.product_id,
      r.order_item_id,
      r.rating,
      r.comment,
      r.created_at,
      r.updated_at,
      u.full_name AS buyer_name
    FROM reviews r
    JOIN users u ON u.id = r.buyer_id
    WHERE r.product_id = ${productId}
    ORDER BY r.created_at DESC
  `;
};

// Get review summary for a product
export const getProductReviewSummary = async (productId) => {
  const result = await sql`
    SELECT
      COUNT(*) AS total_reviews,
      COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating
    FROM reviews
    WHERE product_id = ${productId}
  `;

  return result[0];
};

// Get reviews created by a buyer
export const findBuyerReviews = async (buyerId) => {
  return await sql`
    SELECT
      r.*,
      p.name AS product_name
    FROM reviews r
    JOIN products p ON p.id = r.product_id
    WHERE r.buyer_id = ${buyerId}
    ORDER BY r.created_at DESC
  `;
};

// Find a review by ID
export const findReviewById = async (reviewId) => {
  const result = await sql`
    SELECT *
    FROM reviews
    WHERE id = ${reviewId}
  `;

  return result[0];
};

// Update a review
export const updateReview = async (reviewId, buyerId, data) => {
  const result = await sql`
    UPDATE reviews
    SET
      rating = ${data.rating},
      comment = ${data.comment},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${reviewId}
      AND buyer_id = ${buyerId}
    RETURNING *
  `;

  return result[0];
};

// Delete a buyer's own review
export const deleteReview = async (reviewId, buyerId) => {
  const result = await sql`
    DELETE FROM reviews
    WHERE id = ${reviewId}
      AND buyer_id = ${buyerId}
    RETURNING *
  `;

  return result[0];
};

// Admin deletes any review
export const adminDeleteReview = async (reviewId) => {
  const result = await sql`
    DELETE FROM reviews
    WHERE id = ${reviewId}
    RETURNING *
  `;

  return result[0];
};