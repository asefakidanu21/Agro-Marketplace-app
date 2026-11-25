
import * as OrderModel from "./order.model.js";
import * as CartService from "../carts/cart.service.js";
import * as AddressService from "../addresses/address.service.js";
import * as ProductService from "../products/product.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Place order
export const placeOrder = async (buyerId, data) => {
  if (!["pickup", "delivery"].includes(data.fulfillment_method)) {
    throw createError("Invalid fulfillment method", 400);
  }

  if (data.fulfillment_method === "delivery") {
    if (!data.address_id) {
      throw createError("Delivery address is required", 400);
    }

    await AddressService.getBuyerAddress(data.address_id, buyerId);
  }

  const cart = await CartService.getCart(buyerId);

  if (cart.items.length === 0) {
    throw createError("Your cart is empty", 400);
  }

  // Group products by farmer
  const farmerOrders = {};

  for (const item of cart.items) {
    if (item.status !== "available") {
      throw createError(`${item.name} is unavailable`, 400);
    }

    const farmerId = item.farmer_id;

    if (!farmerOrders[farmerId]) {
      farmerOrders[farmerId] = {
        farmer_id: farmerId,
        address_id: data.fulfillment_method === "delivery"
          ? data.address_id
          : null,
        fulfillment_method: data.fulfillment_method,
        notes: data.notes || null,
        total_amount: 0,
        items: [],
      };
    }

    const quantity = Number(item.quantity);
    const price = Number(item.price);
    const subtotal = price * quantity;

    farmerOrders[farmerId].total_amount += subtotal;

    farmerOrders[farmerId].items.push({
      product_id: item.product_id,
      name: item.name,
      price,
      quantity,
      subtotal,
    });
  }

  const orders = Object.values(farmerOrders);
  const reducedItems = [];

  try {
    // Reduce stock through Products Service
    for (const order of orders) {
      for (const item of order.items) {
        await ProductService.reduceStock(
          item.product_id,
          item.quantity
        );

        reducedItems.push(item);
      }
    }

    // Create orders through Orders Model
    const createdOrders = await OrderModel.createOrders(
      buyerId,
      orders
    );

    // Empty cart through Cart Service
    await CartService.emptyCart(buyerId);

    return createdOrders;
  } catch (error) {
    // Restore stock if order creation fails
    for (const item of reducedItems) {
      await ProductService.restoreStock(
        item.product_id,
        item.quantity
      );
    }

    throw error;
  }
};

// Get buyer's orders
export const getMyOrders = async (buyerId) => {
  return await OrderModel.findBuyerOrders(buyerId);
};

// Get farmer's orders
export const getFarmerOrders = async (farmerId) => {
  return await OrderModel.findFarmerOrders(farmerId);
};

// Get order details
export const getOrderDetails = async (id, userId, role) => {
  const order = await OrderModel.findOrderById(Number(id));

  if (!order) {
    throw createError("Order not found", 404);
  }

  if (
    (role === "buyer" && Number(order.buyer_id) !== Number(userId)) ||
    (role === "farmer" && Number(order.farmer_id) !== Number(userId))
  ) {
    throw createError("You cannot access this order", 403);
  }

  const items = await OrderModel.findOrderItems(id);

  return { order, items };
};

// Update order status
export const changeOrderStatus = async (id, farmerId, status) => {
  const order = await OrderModel.findOrderById(Number(id));

  if (!order) {
    throw createError("Order not found", 404);
  }

  if (Number(order.farmer_id) !== Number(farmerId)) {
    throw createError("You cannot update this order", 403);
  }

  const nextStatuses = {
    pending: ["accepted", "rejected"],
    accepted: ["processing"],
    processing: ["ready_for_delivery"],
    ready_for_delivery: ["completed"],
  };

  if (!nextStatuses[order.status]?.includes(status)) {
    throw createError("Invalid order status change", 400);
  }

  if (status === "rejected") {
    const items = await OrderModel.findOrderItems(id);

    for (const item of items) {
      if (item.product_id !== null) {
        await ProductService.restoreStock(
          item.product_id,
          item.quantity
        );
      }
    }
  }

  return await OrderModel.updateOrderStatus(id, status);
};

// Cancel pending order
export const cancelOrder = async (id, buyerId) => {
  const order = await OrderModel.findOrderById(Number(id));

  if (!order) {
    throw createError("Order not found", 404);
  }

  if (Number(order.buyer_id) !== Number(buyerId)) {
    throw createError("You cannot cancel this order", 403);
  }

  if (order.status !== "pending") {
    throw createError("Only pending orders can be cancelled", 400);
  }

  const items = await OrderModel.findOrderItems(id);

  for (const item of items) {
    if (item.product_id !== null) {
      await ProductService.restoreStock(
        item.product_id,
        item.quantity
      );
    }
  }

  return await OrderModel.updateOrderStatus(id, "cancelled");
};
