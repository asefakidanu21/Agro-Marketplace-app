import * as CartModel from "./cart.model.js";
import { getProductById } from "../products/product.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Get existing cart or create one
const getOrCreateCart = async (buyerId) => {
  let cart = await CartModel.findCartByBuyerId(buyerId);

  if (!cart) {
    cart = await CartModel.createCart(buyerId);
  }

  return cart;
};

// Check product availability and stock
const checkProduct = async (productId, quantity) => {
  const product = await getProductById(productId);

  if (product.status !== "available") {
    throw createError("This product is not available", 400);
  }

  if (quantity > Number(product.quantity)) {
    throw createError("Not enough product stock available", 400);
  }

  return product;
};

// Get buyer's cart
export const getCart = async (buyerId) => {
  const cart = await getOrCreateCart(buyerId);
  const items = await CartModel.findCartItems(cart.id);

  return {
    cart,
    items,
  };
};

// Add product to cart
export const addToCart = async (buyerId, productId, quantity) => {
  productId = Number(productId);
  quantity = Number(quantity);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw createError("Invalid product ID", 400);
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw createError("Quantity must be greater than zero", 400);
  }

  const product = await checkProduct(productId, quantity);
  const cart = await getOrCreateCart(buyerId);

  const existingItem = await CartModel.findCartItem(cart.id, productId);

  if (existingItem) {
    const newQuantity = Number(existingItem.quantity) + quantity;

    if (newQuantity > Number(product.quantity)) {
      throw createError("Not enough product stock available", 400);
    }

    return await CartModel.updateCartItem(
      cart.id,
      existingItem.id,
      newQuantity
    );
  }

  return await CartModel.addCartItem(cart.id, productId, quantity);
};

// Update cart item quantity
export const updateCartQuantity = async (buyerId, itemId, quantity) => {
  itemId = Number(itemId);
  quantity = Number(quantity);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw createError("Invalid cart item ID", 400);
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw createError("Quantity must be greater than zero", 400);
  }

  const cart = await getOrCreateCart(buyerId);
  const item = await CartModel.findCartItemById(cart.id, itemId);

  if (!item) {
    throw createError("Cart item not found", 404);
  }

  await checkProduct(item.product_id, quantity);

  return await CartModel.updateCartItem(cart.id, itemId, quantity);
};

// Remove one item
export const removeFromCart = async (buyerId, itemId) => {
  const cart = await getOrCreateCart(buyerId);

  const item = await CartModel.removeCartItem(cart.id, Number(itemId));

  if (!item) {
    throw createError("Cart item not found", 404);
  }

  return item;
};

// Empty cart
export const emptyCart = async (buyerId) => {
  const cart = await getOrCreateCart(buyerId);

  await CartModel.clearCart(cart.id);

  return true;
};