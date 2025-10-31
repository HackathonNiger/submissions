import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Check for healthcare worker token first, then regular user token
      let token = await AsyncStorage.getItem("worker_token");
      if (!token) {
        token = await AsyncStorage.getItem("token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Log the full URL being called for debugging
      console.log(
        `API Request: ${config.method.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    // Log detailed error information
    if (error.response) {
      console.error(`API Error: ${error.response.status} ${error.config?.url}`);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("Network Error: No response received", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid, clear both tokens
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("worker_token");
    }
    return Promise.reject(error);
  }
);

export default api;
