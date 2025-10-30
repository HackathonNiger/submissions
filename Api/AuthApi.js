// Api/AuthApi.js
import axios from 'axios';

// Replace this with your real API URL
const API_URL = "https://your-api-url.com";

// --- Email/Password Login ---
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    // Return user data or token
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// --- Signup ---
export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// --- Passkey Login ---
// This is a placeholder; replace endpoint and payload as needed
export const passkeyLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/passkey-login`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
