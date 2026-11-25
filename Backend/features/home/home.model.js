


import sql from "../../config/database.js";

// Get categories
export const findHomeCategories = async () => {
  return await sql`
    SELECT *
    FROM categories
    ORDER BY name ASC
  `;
};

// Get latest products
export const findLatestProducts = async () => {
  return await sql`
    SELECT
      p.id,
      p.name,
      p.price,
      p.unit,
      p.quantity,
      p.image_url,
      u.full_name AS farmer_name,
      c.name AS category_name
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'available'
      AND p.quantity > 0
    ORDER BY p.created_at DESC
    LIMIT 10
  `;
};

// Get popular products
export const findPopularProducts = async () => {
  return await sql`
    SELECT
      p.id,
      p.name,
      p.price,
      p.unit,
      p.quantity,
      p.image_url,
      u.full_name AS farmer_name,
      c.name AS category_name,
      COUNT(f.id) AS favorite_count
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN favorites f ON p.id = f.product_id
    WHERE p.status = 'available'
      AND p.quantity > 0
    GROUP BY p.id, u.full_name, c.name
    ORDER BY favorite_count DESC, p.created_at DESC
    LIMIT 10
  `;
};
