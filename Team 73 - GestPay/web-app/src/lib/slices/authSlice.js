import { createSlice } from '@reduxjs/toolkit';
import { gestpayApi } from '../api/gestpayApi';
import { tokenUtils } from '../utils/tokenUtils';

// Helper function to get initial auth state from cookies/localStorage
const getInitialAuthState = () => {
  const token = tokenUtils.getToken();
  const user = tokenUtils.getUser();
  
  return {
    token: token,
    user: user,
    isAuthenticated: !!token,
    isLoading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    // Manual logout action
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear all auth data
      tokenUtils.clearAuth();
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Update user data
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update storage
      tokenUtils.setUser(state.user);
    },
    
    // Hydrate auth state from cookies/localStorage
    hydrateAuth: (state) => {
      const token = tokenUtils.getToken();
      const user = tokenUtils.getUser();
      
      console.log('Hydrating auth state:', { token: token ? 'present' : 'missing', user: user ? 'present' : 'missing' });
      
      if (token) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        console.log('Auth state hydrated successfully');
      } else {
        console.log('No valid token found for hydration');
      }
    },
    
    // Manually set auth data (for immediate token setting)
    setAuthData: (state, action) => {
      const { token, user } = action.payload;
      
      if (token) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
        
        // Save to cookies and localStorage
        tokenUtils.setToken(token);
        tokenUtils.setUser(user);
        
        console.log('Auth data set manually:', { token: token ? 'present' : 'missing' });
      }
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(
      gestpayApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const result = action.payload;
        
        console.log('Auth slice - Login success:', result);
        
        if (result.token) {
          state.token = result.token;
          state.user = result.data; // User data is in result.data, not result.data.user
          state.isAuthenticated = true;
          state.isLoading = false;
          
          // Save to cookies and localStorage
          tokenUtils.setToken(result.token);
          tokenUtils.setUser(result.data);
          
          console.log('Token stored:', result.token);
        }
      }
    );
    
    // Handle login pending
    builder.addMatcher(
      gestpayApi.endpoints.login.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );
    
    // Handle login error
    builder.addMatcher(
      gestpayApi.endpoints.login.matchRejected,
      (state) => {
        state.isLoading = false;
      }
    );
    
    // Handle register success
    builder.addMatcher(
      gestpayApi.endpoints.register.matchFulfilled,
      (state, action) => {
        const result = action.payload;
        
        console.log('Auth slice - Register success:', result);
        
        if (result.token) {
          state.token = result.token;
          state.user = result.data || { 
            id: result.data?.user_id, 
            username: result.data?.username, 
            email: result.data?.email 
          };
          state.isAuthenticated = true;
          state.isLoading = false;
          
          // Save to cookies and localStorage
          tokenUtils.setToken(result.token);
          tokenUtils.setUser(state.user);
        }
      }
    );
    
    // Handle register pending
    builder.addMatcher(
      gestpayApi.endpoints.register.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );
    
    // Handle register error
    builder.addMatcher(
      gestpayApi.endpoints.register.matchRejected,
      (state) => {
        state.isLoading = false;
      }
    );
    
    // Handle getCurrentUser success (for token verification)
    builder.addMatcher(
      gestpayApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        const { data } = action.payload;
        state.user = data;
        
        // Update storage
        tokenUtils.setUser(data);
      }
    );
    
    // Note: No logout endpoint matcher needed since logout is handled manually
  },
});

export const { logout, setLoading, updateUser, hydrateAuth, setAuthData } = authSlice.actions;

// Logout helper function (no API call needed, just clear local state)
export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  // Optionally redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
};

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
