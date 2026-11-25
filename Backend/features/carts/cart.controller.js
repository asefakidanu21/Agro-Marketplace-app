import * as CartService from "./cart.service.js";

// Get cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await CartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Add product to cart
export const addToCart = async (req, res, next) => {
  try {
    const item = await CartService.addToCart(
      req.user.id,
      req.body.product_id,
      req.body.quantity
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req, res, next) => {
  try {
    const item = await CartService.updateCartQuantity(
      req.user.id,
      req.params.id,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Remove one item
export const removeFromCart = async (req, res, next) => {
  try {
    await CartService.removeFromCart(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

// Empty cart
export const emptyCart = async (req, res, next) => {
  try {
    await CartService.emptyCart(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart emptied successfully",
    });
  } catch (error) {
    next(error);
  }
};