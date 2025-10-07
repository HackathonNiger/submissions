import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://gestpay.souktrainproperties.com/api/v1';

// Base query with automatic token handling
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    // Get token from Redux state or SecureStore
    const token = getState().auth.token || await SecureStore.getItemAsync('authToken');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Enhanced base query with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 unauthorized - token expired
  if (result.error && result.error.status === 401) {
    // Clear stored token and logout user
    await SecureStore.deleteItemAsync('authToken');
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Transactions', 'Telegram', 'WhatsApp'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.token) {
            // Store token securely
            await SecureStore.setItemAsync('authToken', data.token);
            // Update Redux state
            dispatch({
              type: 'auth/setCredentials',
              payload: {
                user: data.data,
                token: data.token,
              },
            });
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),

    // Register endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.token) {
            // Store token securely
            await SecureStore.setItemAsync('authToken', data.token);
            // Update Redux state
            dispatch({
              type: 'auth/setCredentials',
              payload: {
                user: data.data,
                token: data.token,
              },
            });
          }
        } catch (error) {
          console.error('Registration error:', error);
        }
      },
    }),

    // Verify token endpoint
    verifyToken: builder.query({
      query: () => '/auth/verify-token',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            // Token is valid, fetch user profile
            dispatch(authApi.endpoints.getUserProfile.initiate());
          }
        } catch (error) {
          // Token is invalid, clear it
          await SecureStore.deleteItemAsync('authToken');
          dispatch({ type: 'auth/logout' });
        }
      },
    }),

    // Get user profile endpoint
    getUserProfile: builder.query({
      query: () => '/user/me',
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch({
              type: 'auth/setCredentials',
              payload: {
                user: data.data,
                token: await SecureStore.getItemAsync('authToken'),
              },
            });
          }
        } catch (error) {
          console.error('Get profile error:', error);
        }
      },
    }),

    // Get wallet transactions endpoint
    getWalletTransactions: builder.query({
      query: () => '/wallet/transactions',
      providesTags: ['Transactions'],
    }),

    // Telegram endpoints
    getTelegramDetails: builder.query({
      query: () => '/telegram/details',
      providesTags: ['Telegram'],
    }),

    disconnectTelegram: builder.mutation({
      query: () => ({
        url: '/telegram/disconnect-telegram',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Telegram'],
    }),

    toggleTelegramPayments: builder.mutation({
      query: (enablePayments) => ({
        url: '/telegram/toggle-payments',
        method: 'POST',
        body: { enable_payments: enablePayments },
      }),
      invalidatesTags: ['User', 'Telegram'],
    }),

    // WhatsApp endpoints
    getWhatsAppDetails: builder.query({
      query: () => '/whatsapp/details',
      providesTags: ['WhatsApp'],
    }),

    disconnectWhatsApp: builder.mutation({
      query: () => ({
        url: '/whatsapp/disconnect-whatsapp',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'WhatsApp'],
    }),

    toggleWhatsAppPayments: builder.mutation({
      query: (enablePayments) => ({
        url: '/whatsapp/toggle-payments',
        method: 'POST',
        body: { enable_payments: enablePayments },
      }),
      invalidatesTags: ['User', 'WhatsApp'],
    }),

    // Logout endpoint (if backend has one)
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Always clear local storage and state
          await SecureStore.deleteItemAsync('authToken');
          dispatch({ type: 'auth/logout' });
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
  useGetUserProfileQuery,
  useGetWalletTransactionsQuery,
  useGetTelegramDetailsQuery,
  useDisconnectTelegramMutation,
  useToggleTelegramPaymentsMutation,
  useGetWhatsAppDetailsQuery,
  useDisconnectWhatsAppMutation,
  useToggleWhatsAppPaymentsMutation,
  useLogoutMutation,
} = authApi;
