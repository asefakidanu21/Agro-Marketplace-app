import sql from "../../config/database.js";

// Create product
export const createProduct = async (productData) => {
  const [product] = await sql`
    INSERT INTO products (
      farmer_id,
      category_id,
      name,
      description,
      price,
      unit,
      quantity,
      image_url
    )
    VALUES (
      ${productData.farmer_id},
      ${productData.category_id},
      ${productData.name},
      ${productData.description},
      ${productData.price},
      ${productData.unit},
      ${productData.quantity},
      ${productData.image_url}
    )
    RETURNING *
  `;

  return product;
};

// Get all products
export const findAllProducts = async () => {
  return await sql`
    SELECT
      p.*,
      u.full_name AS farmer_name,
      c.name AS category_name
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
};

// Get one product by ID
export const findProductById = async (id) => {
  const [product] = await sql`
    SELECT
      p.*,
      u.full_name AS farmer_name,
      u.phone AS farmer_phone,
      c.name AS category_name
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
  `;

  return product;
};

// Update product
export const updateProduct = async (id, productData) => {
  const [product] = await sql`
    UPDATE products
    SET
      category_id = ${productData.category_id},
      name = ${productData.name},
      description = ${productData.description},
      price = ${productData.price},
      unit = ${productData.unit},
      quantity = ${productData.quantity},
      image_url = ${productData.image_url},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return product;
};

// Change product status
export const updateProductStatus = async (id, status) => {
  const [product] = await sql`
    UPDATE products
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return product;
};

// Delete product
export const deleteProduct = async (id) => {
  const [product] = await sql`
    DELETE FROM products
    WHERE id = ${id}
    RETURNING *
  `;

  return product;
};


// Reduce product stock
export const reduceProductStock = async (id, quantity) => {
  const [product] = await sql`
    UPDATE products
    SET
      quantity = quantity - ${quantity},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
      AND status = 'available'
      AND quantity >= ${quantity}
    RETURNING id
  `;

  return product;
};

// Restore product stock
export const restoreProductStock = async (id, quantity) => {
  return await sql`
    UPDATE products
    SET
      quantity = quantity + ${quantity},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
};
