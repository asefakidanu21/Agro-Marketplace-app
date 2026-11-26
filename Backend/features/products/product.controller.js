
import * as ProductService from "./product.service.js";
import uploadImage from "../../config/uploadImage.js";

// Create product
export const createProduct = async (req, res, next) => {
  try {
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const product = await ProductService.createProduct(req.user.id, {
      ...req.body,
      image_url: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in farmer's products
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getMyProducts(req.user.id);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    let imageUrl;

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const product = await ProductService.updateProduct(
      req.params.id,
      req.user.id,
      {
        ...req.body,
        ...(imageUrl && { image_url: imageUrl }),
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Change product status
export const changeProductStatus = async (req, res, next) => {
  try {
    const product = await ProductService.changeProductStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
