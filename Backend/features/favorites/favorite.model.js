


import sql from "../../config/database.js";

// Add product to favorites
export const addFavorite = async (buyerId, productId) => {
  const [favorite] = await sql`
    INSERT INTO favorites (buyer_id, product_id)
    VALUES (${buyerId}, ${productId})
    RETURNING *
  `;

  return favorite;
};

// Get buyer's favorite products
export const findFavorites = async (buyerId) => {
  return await sql`
    SELECT
      f.id,
      f.product_id,
      f.created_at,
      p.name,
      p.price,
      p.unit,
      p.image_url,
      p.status,
      u.full_name AS farmer_name
    FROM favorites f
    JOIN products p ON f.product_id = p.id
    JOIN users u ON p.farmer_id = u.id
    WHERE f.buyer_id = ${buyerId}
    ORDER BY f.created_at DESC
  `;
};

// Find favorite
export const findFavorite = async (buyerId, productId) => {
  const [favorite] = await sql`
    SELECT *
    FROM favorites
    WHERE buyer_id = ${buyerId}
      AND product_id = ${productId}
  `;

  return favorite;
};

// Remove favorite
export const removeFavorite = async (buyerId, productId) => {
  const [favorite] = await sql`
    DELETE FROM favorites
    WHERE buyer_id = ${buyerId}
      AND product_id = ${productId}
    RETURNING *
  `;

  return favorite;
};
