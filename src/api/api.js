
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(async (config) => {
  let token;

  if (Platform.OS === "web") {
    token = localStorage.getItem("token");
  } else {
    token = await AsyncStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
