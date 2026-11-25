
import * as PaymentService from "./payment.service.js";

// Create payment
export const createPayment = async (req, res, next) => {
  try {
    const payment = await PaymentService.createPayment(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get order payments
export const getOrderPayments = async (req, res, next) => {
  try {
    const payments = await PaymentService.getOrderPayments(
      req.params.orderId,
      req.user.id
    );

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment (admin only)
export const confirmPayment = async (req, res, next) => {
  try {
    const payment = await PaymentService.confirmPayment(
      req.params.id,
      req.body.status,
      req.body.transaction_reference
    );

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
