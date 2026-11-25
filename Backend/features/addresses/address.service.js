
import * as AddressModel from "./address.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create address
export const createAddress = async (userId, data) => {
  if (!data.region || !data.city) {
    throw createError("Region and city are required", 400);
  }

  return await AddressModel.createAddress(userId, {
    region: data.region,
    city: data.city,
    sub_city: data.sub_city || null,
    woreda: data.woreda || null,
    kebele: data.kebele || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
  });
};

// Get user's addresses
export const getMyAddresses = async (userId) => {
  return await AddressModel.findUserAddresses(userId);
};

// Get one address
export const getAddressById = async (id, userId) => {
  const address = await AddressModel.findAddressById(
    Number(id),
    userId
  );

  if (!address) {
    throw createError("Address not found", 404);
  }

  return address;
};

// Used by Orders to verify address ownership
export const getBuyerAddress = async (id, buyerId) => {
  return await getAddressById(id, buyerId);
};

// Update address
export const updateAddress = async (id, userId, data) => {
  if (!data.region || !data.city) {
    throw createError("Region and city are required", 400);
  }

  const address = await AddressModel.updateAddress(
    Number(id),
    userId,
    {
      region: data.region,
      city: data.city,
      sub_city: data.sub_city || null,
      woreda: data.woreda || null,
      kebele: data.kebele || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    }
  );

  if (!address) {
    throw createError("Address not found", 404);
  }

  return address;
};

// Set default address
export const makeDefaultAddress = async (id, userId) => {
  const address = await AddressModel.setDefaultAddress(
    Number(id),
    userId
  );

  if (!address) {
    throw createError("Address not found", 404);
  }

  return address;
};

// Delete address
export const removeAddress = async (id, userId) => {
  const address = await AddressModel.deleteAddress(
    Number(id),
    userId
  );

  if (!address) {
    throw createError("Address not found", 404);
  }

  return address;
};
