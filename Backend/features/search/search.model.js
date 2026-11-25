


import sql from "../../config/database.js";

// Search and filter products
export const searchProducts = async (filters) => {
  return await sql`
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.unit,
      p.quantity,
      p.image_url,
      p.category_id,
      c.name AS category_name,
      u.full_name AS farmer_name
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'available'
      AND p.quantity > 0
      AND (
        ${filters.name ? filters.name : null} IS NULL
        OR p.name ILIKE ${filters.name ? `%${filters.name}%` : null}
      )
      AND (
        ${filters.category_id || null} IS NULL
        OR p.category_id = ${filters.category_id || null}
      )
      AND (
        ${filters.min_price ?? null} IS NULL
        OR p.price >= ${filters.min_price ?? null}
      )
      AND (
        ${filters.max_price ?? null} IS NULL
        OR p.price <= ${filters.max_price ?? null}
      )
    ORDER BY p.created_at DESC
  `;
};
