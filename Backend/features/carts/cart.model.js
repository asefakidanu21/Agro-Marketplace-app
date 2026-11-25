import sql from "../../config/database.js";

// Find buyer's cart
export const findCartByBuyerId = async (buyerId) => {
  const [cart] = await sql`
    SELECT *
    FROM carts
    WHERE buyer_id = ${buyerId}
  `;

  return cart;
};

// Create buyer's cart
export const createCart = async (buyerId) => {
  const [cart] = await sql`
    INSERT INTO carts (buyer_id)
    VALUES (${buyerId})
    RETURNING *
  `;

  return cart;
};

// Get all items in a cart
export const findCartItems = async (cartId) => {
  return await sql`
    SELECT
      ci.id,
      ci.product_id,
      p.farmer_id,
      p.quantity AS available_stock,
      p.name,
      ci.quantity,
      p.price,
      p.unit,
      p.image_url,
      p.status,
      (p.price * ci.quantity) AS subtotal
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ${cartId}
    ORDER BY ci.created_at DESC
  `;
};

// Find a cart item by product ID
export const findCartItem = async (cartId, productId) => {
  const [item] = await sql`
    SELECT *
    FROM cart_items
    WHERE cart_id = ${cartId}
      AND product_id = ${productId}
  `;

  return item;
};

// Add a new item to cart
export const addCartItem = async (cartId, productId, quantity) => {
  const [item] = await sql`
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (${cartId}, ${productId}, ${quantity})
    RETURNING *
  `;

  return item;
};

// Update cart item quantity
export const updateCartItem = async (cartId, itemId, quantity) => {
  const [item] = await sql`
    UPDATE cart_items
    SET
      quantity = ${quantity},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${itemId}
      AND cart_id = ${cartId}
    RETURNING *
  `;

  return item;
};

// Remove one item from cart
export const removeCartItem = async (cartId, itemId) => {
  const [item] = await sql`
    DELETE FROM cart_items
    WHERE id = ${itemId}
      AND cart_id = ${cartId}
    RETURNING *
  `;

  return item;
};

// Remove all items from cart
export const clearCart = async (cartId) => {
  return await sql`
    DELETE FROM cart_items
    WHERE cart_id = ${cartId}
  `;
};