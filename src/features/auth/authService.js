
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Save token
export const saveToken = async (token) => {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
  } else {
    await AsyncStorage.setItem("token", token);
  }
};

// Read token
export const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }

  return await AsyncStorage.getItem("token");
};

// Remove token
export const removeToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    await AsyncStorage.removeItem("token");
  }
};

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  await saveToken(response.data.data.token);

  return response.data.data;
};

// Login
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  await saveToken(response.data.data.token);

  return response.data.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.data;
};
