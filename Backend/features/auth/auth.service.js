
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as authModel from "./auth.model.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Generate JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Register a new farmer or buyer
export const register = async (userData) => {
  const { full_name, email, phone, password, role } = userData;

  if (!full_name || !email || !phone || !password || !role) {
    throw createError("All fields are required", 400);
  }

  if (
    typeof full_name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof password !== "string"
  ) {
    throw createError("Invalid input data", 400);
  }

  const cleanName = full_name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  if (!cleanName || !cleanEmail || !cleanPhone) {
    throw createError("All fields are required", 400);
  }

  if (password.length < 8) {
    throw createError("Password must be at least 8 characters", 400);
  }

  // Public registration cannot create admin accounts
  if (!["farmer", "buyer"].includes(role)) {
    throw createError("Role must be farmer or buyer", 400);
  }

  // Check whether email is already registered
  const existingUser = await authModel.findAccountByEmail(cleanEmail);

  if (existingUser) {
    throw createError("Email is already registered", 409);
  }

  // Hash password before saving
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const user = await authModel.createAccount({
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password_hash,
      role,
    });

    const token = generateToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      if (error.constraint?.includes("phone")) {
        throw createError("Phone number is already registered", 409);
      }

      if (error.constraint?.includes("email")) {
        throw createError("Email is already registered", 409);
      }

      throw createError("Email or phone number is already registered", 409);
    }

    throw error;
  }
};

// Login an existing user
export const login = async (loginData) => {
  const { email, password } = loginData;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw createError("Email and password are required", 400);
  }

  const cleanEmail = email.trim().toLowerCase();

  const user = await authModel.findAccountByEmail(cleanEmail);

  // Use a generic message for invalid credentials
  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  if (!user.is_active) {
    throw createError("Your account is inactive", 403);
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  // Never return the password hash
  const { password_hash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

// Get the currently authenticated user's profile
export const getCurrentUser = async (userId) => {
  const user = await authModel.findPublicUserById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};
