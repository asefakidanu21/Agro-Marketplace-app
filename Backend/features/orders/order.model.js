
import sql from "../../config/database.js";

// Create orders and their items
export const createOrders = async (buyerId, orders) => {
  return await sql.begin(async (tx) => {
    const createdOrders = [];

    for (const data of orders) {
      const [order] = await tx`
        INSERT INTO orders (
          buyer_id,
          farmer_id,
          address_id,
          total_amount,
          fulfillment_method,
          notes
        )
        VALUES (
          ${buyerId},
          ${data.farmer_id},
          ${data.address_id},
          ${data.total_amount},
          ${data.fulfillment_method},
          ${data.notes}
        )
        RETURNING *
      `;

      for (const item of data.items) {
        await tx`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            subtotal
          )
          VALUES (
            ${order.id},
            ${item.product_id},
            ${item.name},
            ${item.price},
            ${item.quantity},
            ${item.subtotal}
          )
        `;
      }

      createdOrders.push(order);
    }

    return createdOrders;
  });
};

// Get buyer's orders
export const findBuyerOrders = async (buyerId) => {
  return await sql`
    SELECT *
    FROM orders
    WHERE buyer_id = ${buyerId}
    ORDER BY created_at DESC
  `;
};

// Get farmer's orders
export const findFarmerOrders = async (farmerId) => {
  return await sql`
    SELECT *
    FROM orders
    WHERE farmer_id = ${farmerId}
    ORDER BY created_at DESC
  `;
};

// Find one order
export const findOrderById = async (id) => {
  const [order] = await sql`
    SELECT *
    FROM orders
    WHERE id = ${id}
  `;

  return order;
};

// Get order items
export const findOrderItems = async (orderId) => {
  return await sql`
    SELECT *
    FROM order_items
    WHERE order_id = ${orderId}
  `;
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  const [order] = await sql`
    UPDATE orders
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return order;
};
