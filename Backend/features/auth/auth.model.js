
import {
  findUserByEmail,
  createUser,
  findUserById,
} from "../users/user.model.js";

// Find an account using its email
export const findAccountByEmail = async (email) => {
  return await findUserByEmail(email);
};

// Create a new account through the Users model
export const createAccount = async (userData) => {
  return await createUser(userData);
};

// Get public user information
export const findPublicUserById = async (id) => {
  return await findUserById(id);
};
