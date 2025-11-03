import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import api from "../api";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from AsyncStorage
  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Token exists, fetch current user
        const response = await api.get("/api/user");

        console.log("Initialize auth user fetch response:", response.data);

        if (response.data.success) {
          // Sync language preference with translator
          const userLanguage = response.data.data?.preferredLanguages || "en";
          try {
            const { setLanguage } = await import("./useTranslatorStore");
            await setLanguage.getState().setLanguage(userLanguage);
          } catch (err) {
            console.log("Failed to sync translator language:", err);
          }

          set({
            user: response.data.data,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token invalid, clear storage
          await AsyncStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        // No token found
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Initialize auth error:", error);
      // Clear invalid token
      await AsyncStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error.response?.data?.error || "Failed to initialize authentication",
      });
    }
  },

  // Sign up action
  signUp: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/auth/register", {
        name,
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
      const errorMessage = error.response?.data?.error || "Failed to sign up";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Login action
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Attempting login for:", email);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.success && response.data.token) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem("token", response.data.token);
        console.log("Token saved successfully");

        // Fetch current user with the new token
        const userResponse = await api.get("/api/user");
        console.log("User data fetched:", userResponse.data);

        if (userResponse.data.success) {
          // Sync language preference with translator
          const userLanguage =
            userResponse.data.data?.preferredLanguages || "en";
          try {
            const { setLanguage } = await import("./useTranslatorStore");
            await setLanguage.getState().setLanguage(userLanguage);
          } catch (err) {
            console.log("Failed to sync translator language:", err);
          }

          set({
            user: userResponse.data.data,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, message: response.data.message };
        } else {
          throw new Error("Failed to fetch user data");
        }
      } else {
        set({ isLoading: false, error: response.data.error });
        return { success: false, error: response.data.error };
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
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Backend might be down.";
      } else if (error.response?.status === 401) {
        errorMessage =
          error.response.data?.error || "Invalid email or password";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
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
      await AsyncStorage.removeItem("token");

      // Reset state
      set({
        user: null,
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

  // Refresh user data
  refreshUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/api/user");

      if (response.data.success) {
        set({
          user: response.data.data,
          error: null,
        });
        return { success: true };
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to refresh user data";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update language preference
  updateLanguagePreference: async (preferredLanguages) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.put("/api/user/update-language", {
        preferredLanguages,
      });

      if (response.data.success) {
        set({
          user: response.data.data,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.data.message };
      } else {
        set({ isLoading: false, error: response.data.error });
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Update language error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update language preference";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update profile information
  updateProfileInformation: async (profileData) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Updating profile with:", profileData);

      const response = await api.put("/api/user/profile-info", profileData);

      console.log("Profile update response:", response.data);

      if (response.data.success) {
        set({
          user: response.data.data,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.data.message };
      } else {
        set({ isLoading: false, error: response.data.error });
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.error || "Failed to update profile information";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Submit antenatal data
  submitAntenatalData: async (antenatalData) => {
    try {
      set({ isLoading: true, error: null });

      const { token } = get();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("Submitting antenatal data:", antenatalData);

      const response = await api.post(
        "/api/antenatal/",
        {
          bloodPressure: antenatalData.bloodPressure,
          temperature: antenatalData.temperature,
          weight: antenatalData.weight,
          bloodLevel: antenatalData.bloodLevel,
          prescribedDrugs: antenatalData.prescribedDrugs,
          drugsToAvoid: antenatalData.drugsToAvoid,
          date: antenatalData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Antenatal data submission response:", response.data);

      if (response.status === 200 || response.status === 201) {
        set({ isLoading: false, error: null });
        return { success: true, message: "Antenatal info saved successfully" };
      } else {
        set({
          isLoading: false,
          error: response.data?.error || "Unexpected response",
        });
        return {
          success: false,
          error: response.data?.error || "Unexpected response",
        };
      }
    } catch (error) {
      console.error("Antenatal submission error:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to submit antenatal data";

      set({ isLoading: false, error: errorMessage });

      return { success: false, error: errorMessage };
    }
  },

  // Check if user has completed profile setup
  hasCompletedProfile: () => {
    const { user } = get();
    if (!user) return false;

    // Check if user has filled essential information
    return !!(
      user.preferredLanguages &&
      user.name &&
      user.address &&
      user.lastPeriodDate &&
      user.emergencyContact &&
      user.emergencyContact.length > 0
    );
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
