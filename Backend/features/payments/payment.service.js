
import * as PaymentModel from "./payment.model.js";
import * as OrderService from "../orders/order.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create payment
export const createPayment = async (buyerId, data) => {
  const orderId = Number(data.order_id);

  if (!orderId || !data.payment_method) {
    throw createError("Order ID and payment method are required", 400);
  }

const result = await OrderService.getOrderDetails(orderId, buyerId);

const order = result.order;

if (order.status !== "accepted") {
  throw createError("Payment can only be created for accepted orders", 400);
}

  const allowedMethods = [
    "cash_on_delivery",
    "cash_on_pickup",
    "telebirr",
    "cbe_birr",
    "bank_transfer",
  ];

  if (!allowedMethods.includes(data.payment_method)) {
    throw createError("Invalid payment method", 400);
  }

  const payments = await PaymentModel.findPaymentsByOrderId(orderId);

  if (payments.some((payment) => payment.payment_status === "paid")) {
    throw createError("This order has already been paid", 400);
  }

  return await PaymentModel.createPayment({
    order_id: orderId,
    amount: order.total_amount,
    payment_method: data.payment_method,
  });
};

// Get payments for buyer's order
export const getOrderPayments = async (orderId, buyerId) => {
  await OrderService.getOrderDetails(Number(orderId), buyerId);

  return await PaymentModel.findPaymentsByOrderId(Number(orderId));
};

// Confirm payment
export const confirmPayment = async (paymentId, status, reference) => {
  const payment = await PaymentModel.findPaymentById(Number(paymentId));

  if (!payment) {
    throw createError("Payment not found", 404);
  }

  if (payment.payment_status !== "pending") {
    throw createError("Payment is not pending", 400);
  }

  if (!["paid", "failed"].includes(status)) {
    throw createError("Invalid payment status", 400);
  }

  if (status === "paid" && !reference) {
    throw createError("Transaction reference is required", 400);
  }

  try {
    return await PaymentModel.updatePaymentStatus(
      payment.id,
      status,
      reference || null
    );
  } catch (error) {
    if (error.code === "23505") {
      throw createError("Transaction reference already exists", 409);
    }

    throw error;
  }
};
