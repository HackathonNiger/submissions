import { storage, STORAGE_KEYS } from '../utils/secureStorage';
import { store } from '../store';
import { setCredentials, logout, setInitialized } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';

class AuthService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize authentication state on app startup
  async initializeAuth() {
    try {
      const { token, user } = await storage.getAuthData();
      
      if (token && user) {
        // Set credentials in Redux
        store.dispatch(setCredentials({ token, user }));
        
        // Verify token with backend
        try {
          await store.dispatch(authApi.endpoints.verifyToken.initiate()).unwrap();
        } catch (error) {
          console.log('Token verification failed, clearing auth data');
          await this.clearAuthData();
        }
      }
      
      store.dispatch(setInitialized());
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Auth initialization error:', error);
      store.dispatch(setInitialized());
      this.isInitialized = true;
      return false;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const result = await store.dispatch(
        authApi.endpoints.login.initiate({ email, password })
      ).unwrap();

      if (result.success) {
        // Token is at root level, user data is in result.data
        const token = result.token;
        const user = result.data;
        
        // Save to secure storage
        await storage.saveAuthData(token, user);
        
        // Update Redux state
        store.dispatch(setCredentials({ user, token }));
        
        return { success: true, data: { user, token } };
      }
      
      return { success: false, error: result.message || 'Login failed' };
    } catch (error) {
      console.error('Login service error:', error);
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Login failed' 
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const result = await store.dispatch(
        authApi.endpoints.register.initiate(userData)
      ).unwrap();

      if (result.success) {
        // Token is at root level, user data is in result.data
        const token = result.token;
        const user = result.data;
        
        // Save to secure storage
        await storage.saveAuthData(token, user);
        
        // Update Redux state
        store.dispatch(setCredentials({ user, token }));
        
        return { success: true, data: { user, token } };
      }
      
      return { success: false, error: result.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration service error:', error);
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Registration failed' 
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Try to call backend logout endpoint
      try {
        await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
      } catch (error) {
        console.log('Backend logout failed, continuing with local logout');
      }
      
      // Clear local storage and state
      await this.clearAuthData();
      store.dispatch(logout());
      
      return { success: true };
    } catch (error) {
      console.error('Logout service error:', error);
      // Still clear local data even if there's an error
      await this.clearAuthData();
      store.dispatch(logout());
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }

  // Get current token
  getCurrentToken() {
    const state = store.getState();
    return state.auth.token;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const state = store.getState();
    return state.auth.isAuthenticated;
  }

  // Clear authentication data
  async clearAuthData() {
    try {
      await storage.clearAuthData();
      return true;
    } catch (error) {
      console.error('Clear auth data error:', error);
      return false;
    }
  }

  // Refresh user profile
  async refreshUserProfile() {
    try {
      const result = await store.dispatch(
        authApi.endpoints.getUserProfile.initiate()
      ).unwrap();
      
      if (result.success) {
        const currentToken = this.getCurrentToken();
        store.dispatch(setCredentials({ 
          user: result.data, 
          token: currentToken 
        }));
        
        // Update stored user data
        await storage.secure.setItem(STORAGE_KEYS.USER_DATA, result.data);
        
        return { success: true, data: result.data };
      }
      
      return { success: false, error: 'Failed to refresh profile' };
    } catch (error) {
      console.error('Refresh profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate token
  async validateToken() {
    try {
      const result = await store.dispatch(
        authApi.endpoints.verifyToken.initiate()
      ).unwrap();
      
      return result.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
