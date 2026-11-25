
import * as userModel from "./user.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Get user by ID
export const getUserById = async (id) => {
  const user = await userModel.findUserById(id);

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};

// Get user by email
// Used by Auth feature
export const getUserByEmail = async (email) => {
  return await userModel.findUserByEmail(email.trim().toLowerCase());
};

// Create user
// Used by Auth feature after password hashing
export const createUser = async (userData) => {
  return await userModel.createUser({
    ...userData,
    email: userData.email.trim().toLowerCase(),
  });
};

// Get all users
export const getAllUsers = async (page = 1, limit = 10) => {
  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

  const offset = (pageNumber - 1) * pageSize;

  const users = await userModel.findAllUsers(pageSize, offset);

  return {
    users,
    pagination: {
      page: pageNumber,
      limit: pageSize,
    },
  };
};

// Update user profile
export const updateUserProfile = async (id, data) => {
  const existingUser = await userModel.findUserById(id);

  if (!existingUser) {
    throw createError("User not found", 404);
  }

  const allowedFields = ["full_name", "phone", "profile_image"];

  const hasChanges = allowedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(data, field)
  );

  if (!hasChanges) {
    throw createError("No profile fields provided", 400);
  }

  const updatedData = {
    full_name: data.full_name ?? existingUser.full_name,
    phone: data.phone ?? existingUser.phone,
    profile_image: Object.prototype.hasOwnProperty.call(
      data,
      "profile_image"
    )
      ? data.profile_image
      : existingUser.profile_image,
  };

  if (!updatedData.full_name.trim()) {
    throw createError("Full name is required", 400);
  }

  if (!updatedData.phone.trim()) {
    throw createError("Phone number is required", 400);
  }

  return await userModel.updateUser(id, updatedData);
};

// Change user status
export const changeUserStatus = async (id, is_active) => {
  if (typeof is_active !== "boolean") {
    throw createError("is_active must be true or false", 400);
  }

  const user = await userModel.updateUserStatus(id, is_active);

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};
