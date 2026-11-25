
import * as AddressService from "./address.service.js";

// Create address
export const createAddress = async (req, res, next) => {
  try {
    const address = await AddressService.createAddress(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's addresses
export const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await AddressService.getMyAddresses(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Get one address
export const getAddressById = async (req, res, next) => {
  try {
    const address = await AddressService.getAddressById(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const address = await AddressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// Set default address
export const makeDefaultAddress = async (req, res, next) => {
  try {
    const address = await AddressService.makeDefaultAddress(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
export const removeAddress = async (req, res, next) => {
  try {
    await AddressService.removeAddress(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
