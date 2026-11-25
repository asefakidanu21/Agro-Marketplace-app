
import sql from "../../config/database.js";

// Create payment
export const createPayment = async (data) => {
  const [payment] = await sql`
    INSERT INTO payments (
      order_id,
      amount,
      payment_method
    )
    VALUES (
      ${data.order_id},
      ${data.amount},
      ${data.payment_method}
    )
    RETURNING *
  `;

  return payment;
};

// Find payment by ID
export const findPaymentById = async (id) => {
  const [payment] = await sql`
    SELECT *
    FROM payments
    WHERE id = ${id}
  `;

  return payment;
};

// Get payments for an order
export const findPaymentsByOrderId = async (orderId) => {
  return await sql`
    SELECT *
    FROM payments
    WHERE order_id = ${orderId}
    ORDER BY created_at DESC
  `;
};

// Update payment status
export const updatePaymentStatus = async (
  id,
  status,
  transactionReference
) => {
  const [payment] = await sql`
    UPDATE payments
    SET
      payment_status = ${status},
      transaction_reference = ${transactionReference},
      paid_at = CASE
        WHEN ${status} = 'paid' THEN CURRENT_TIMESTAMP
        ELSE paid_at
      END
    WHERE id = ${id}
    RETURNING *
  `;

  return payment;
};
