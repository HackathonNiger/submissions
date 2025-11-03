import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import api from "../api";

const useAuthWorkerStore = create((set, get) => ({
  // State
  worker: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from AsyncStorage
  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = await AsyncStorage.getItem("worker_token");

      if (token) {
        // Token exists, fetch current worker
        const response = await api.get("/api/auth_chw/current_chw");

        console.log("Initialize auth worker fetch response:", response.data);

        if (response.data.success) {
          // Sync language preference with translator
          // First check if there's a locally saved language preference
          let workerLanguage = await AsyncStorage.getItem("worker_language");

          // If no local preference, use the one from API response
          if (!workerLanguage) {
            workerLanguage = response.data.data?.preferredLanguages || "en";
          }

          try {
            const { setLanguage } = await import("./useTranslatorStore");
            await setLanguage.getState().setLanguage(workerLanguage);
          } catch (err) {
            console.log("Failed to sync translator language:", err);
          }

          set({
            worker: response.data.data,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token invalid, clear storage
          await AsyncStorage.removeItem("worker_token");
          set({
            worker: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        // No token found
        set({
          worker: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Initialize auth error:", error);
      // Clear invalid token
      await AsyncStorage.removeItem("worker_token");
      set({
        worker: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error.response?.data?.error || "Failed to initialize authentication",
      });
    }
  },

  // Sign up action for healthcare workers
  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/auth_chw/register_chw", {
        email,
        password,
      });

      if (response.data.success) {
        // Sign up successful, but don't auto-login
        // Return success so UI can navigate to login
        set({ isLoading: false, error: null });
        return { success: true, message: response.data.message };
      } else {
        set({ isLoading: false, error: response.data.error });
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to sign up";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Login action for healthcare workers
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Attempting CHW login for:", email);

      const response = await api.post("/api/auth_chw/login_chw", {
        email,
        password,
      });

      console.log("CHW Login response:", response.data);

      if (response.data.success && response.data.token) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem("worker_token", response.data.token);
        console.log("Worker token saved successfully");

        // Fetch current worker with the new token
        const workerResponse = await api.get("/api/auth_chw/current_chw");
        console.log("Worker data fetched:", workerResponse.data);

        if (workerResponse.data.success) {
          // Sync language preference with translator
          // First check if there's a locally saved language preference
          let workerLanguage = await AsyncStorage.getItem("worker_language");

          // If no local preference, use the one from API response
          if (!workerLanguage) {
            workerLanguage =
              workerResponse.data.data?.preferredLanguages || "en";
          }

          try {
            const { setLanguage } = await import("./useTranslatorStore");
            await setLanguage.getState().setLanguage(workerLanguage);
          } catch (err) {
            console.log("Failed to sync translator language:", err);
          }

          set({
            worker: workerResponse.data.data,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, message: response.data.message };
        } else {
          throw new Error("Failed to fetch worker data");
        }
      } else {
        set({
          isLoading: false,
          error: response.data.error || response.data.message,
        });
        return {
          success: false,
          error: response.data.error || response.data.message,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config?.url,
      });

      let errorMessage = "Failed to login";
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage =
          "Request timeout. The server might be waking up, please try again.";
      } else if (error.response?.status === 500) {
        // 500 errors with "Cannot read properties of null" typically mean user not found
        const errorText = error.response.data?.error || "";
        if (
          errorText.includes("Cannot read properties of null") ||
          errorText.includes("password")
        ) {
          errorMessage =
            "Account not found. Please check your email or sign up.";
        } else {
          errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            "Server error. Please try again.";
        }
      } else if (error.response?.status === 404) {
        errorMessage =
          error.response.data?.message || "Invalid email or password";
      } else if (error.response?.status === 401) {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Invalid email or password";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Invalid request. Please check your input.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response && error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem("worker_token");

      // Reset state
      set({
        worker: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Failed to logout" };
    }
  },

  // Refresh worker data
  refreshWorker: async () => {
    try {
      const token = await AsyncStorage.getItem("worker_token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/api/auth_chw/current_chw");

      if (response.data.success) {
        set({
          worker: response.data.data,
          error: null,
        });
        return { success: true };
      } else {
        throw new Error("Failed to fetch worker data");
      }
    } catch (error) {
      console.error("Refresh worker error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to refresh worker data";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update healthcare worker profile information
  updateProfileInformation: async (profileData) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Updating CHW profile with:", profileData);

      const response = await api.put("/api/auth_chw/chw_profile", profileData);

      console.log("CHW Profile update response:", response.data);

      if (response.data.success) {
        set({
          worker: response.data.data,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.data.message };
      } else {
        set({
          isLoading: false,
          error: response.data.error || response.data.message,
        });
        return {
          success: false,
          error: response.data.error || response.data.message,
        };
      }
    } catch (error) {
      console.error("Update CHW profile error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile information";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Check if worker has completed profile setup
  hasCompletedProfile: () => {
    const { worker } = get();
    if (!worker) return false;

    // Check if worker has filled essential information
    return !!(
      worker.fullName &&
      worker.state &&
      worker.localGovernment &&
      worker.facilityName &&
      worker.facilityCode
    );
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthWorkerStore;
