import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for secure storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  PIN_HASH: 'pinHash',
  REMEMBER_ME: 'rememberMe',
};

// Secure storage functions for sensitive data
export const secureStorage = {
  // Store sensitive data securely
  async setItem(key, value) {
    try {
      // Ensure value is always a string
      let stringValue;
      if (typeof value === 'string') {
        stringValue = value;
      } else if (value === null || value === undefined) {
        stringValue = '';
      } else {
        stringValue = JSON.stringify(value);
      }
      await SecureStore.setItemAsync(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error storing secure item ${key}:`, error);
      return false;
    }
  },

  // Get sensitive data securely
  async getItem(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return value; // Return as string if not JSON
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting secure item ${key}:`, error);
      return null;
    }
  },

  // Remove sensitive data
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
      return false;
    }
  },

  // Clear all secure data
  async clear() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
      return true;
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      return false;
    }
  },
};

// Regular storage functions for non-sensitive data
export const regularStorage = {
  // Store non-sensitive data
  async setItem(key, value) {
    try {
      // Ensure value is always a string
      let stringValue;
      if (typeof value === 'string') {
        stringValue = value;
      } else if (value === null || value === undefined) {
        stringValue = '';
      } else {
        stringValue = JSON.stringify(value);
      }
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
      return false;
    }
  },

  // Get non-sensitive data
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return value; // Return as string if not JSON
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  // Remove non-sensitive data
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  },

  // Clear all non-sensitive data
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};

// Combined storage utility
export const storage = {
  secure: secureStorage,
  regular: regularStorage,
  
  // Convenience methods for auth
  async saveAuthData(token, user) {
    const results = await Promise.all([
      secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
      secureStorage.setItem(STORAGE_KEYS.USER_DATA, user),
    ]);
    return results.every(result => result === true);
  },

  async getAuthData() {
    const [token, user] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      secureStorage.getItem(STORAGE_KEYS.USER_DATA),
    ]);
    return { token, user };
  },

  async clearAuthData() {
    const results = await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      secureStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
    return results.every(result => result === true);
  },
};
