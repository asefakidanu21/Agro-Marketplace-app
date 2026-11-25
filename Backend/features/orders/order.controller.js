
import * as OrderService from "./order.service.js";

// Place order
export const placeOrder = async (req, res, next) => {
  try {
    const orders = await OrderService.placeOrder(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get buyer's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.getMyOrders(req.user.id);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get farmer's orders
export const getFarmerOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.getFarmerOrders(req.user.id);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get order details
export const getOrderDetails = async (req, res, next) => {
  try {
    const result = await OrderService.getOrderDetails(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
export const changeOrderStatus = async (req, res, next) => {
  try {
    const order = await OrderService.changeOrderStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await OrderService.cancelOrder(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
