import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenUtils } from '../utils/tokenUtils';

const BASE_URL = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  ? '/api/v1' // Use proxy for both development and production (Vercel)
  : '/api/v1'; // Use proxy in development

// Base query with auth token injection
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint, extraOptions }) => {
    // Get token from Redux state first, then fallback to cookies/localStorage
    const authState = getState()?.auth;
    let token = authState?.token;
    
    // Fallback to tokenUtils if token not in Redux state
    if (!token) {
      token = tokenUtils.getToken();
    }
    
    // Debug logging
    console.log('API Request Debug:', {
      endpoint,
      reduxToken: authState?.token,
      cookieToken: tokenUtils.getToken(),
      finalToken: token,
      willSetAuth: !!token
    });
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Don't set content-type for FormData requests
    if (!extraOptions?.isFormData) {
      headers.set('content-type', 'application/json');
    }
    
    return headers;
  },
});

// Base query with re-auth logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh or logout
  if (result.error && result.error.status === 401) {
    // Clear auth state and redirect to login
    api.dispatch({ type: 'auth/logout' });
    tokenUtils.clearAuth();
  }
  
  return result;
};

export const gestpayApi = createApi({
  reducerPath: 'gestpayApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 
    'Transaction', 
    'Wallet', 
    'Notification', 
    'Dashboard'
  ],
  endpoints: (builder) => ({
    
    // ========== AUTHENTICATION ENDPOINTS ==========
    
    // Register new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Dashboard'],
    }),
    
    // Verify token
    verifyToken: builder.query({
      query: () => '/auth/verify-token',
      providesTags: ['User'],
    }),
    
    // ========== USER MANAGEMENT ENDPOINTS ==========
    
    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/user/me',
      providesTags: ['User'],
    }),
    
    // Get specific user profile
    getUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    
    // Set transaction PIN
    setPin: builder.mutation({
      query: (pinData) => ({
        url: '/user/set-pin',
        method: 'POST',
        body: pinData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update transaction PIN
    updatePin: builder.mutation({
      query: (pinData) => ({
        url: '/user/update-pin',
        method: 'POST',
        body: pinData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/user/update-password',
        method: 'POST',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update user settings
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: '/user/settings',
        method: 'POST',
        body: settings,
      }),
      invalidatesTags: ['User'],
    }),
    
    // ========== TRANSACTION ENDPOINTS ==========
    
    // Get transaction history
    getTransactions: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/wallet/transactions?${searchParams.toString()}`;
      },
      providesTags: ['Transaction'],
    }),
    
    // Get specific transaction
    getTransaction: builder.query({
      query: (transactionId) => `/wallet/transactions/${transactionId}`,
      providesTags: (result, error, transactionId) => [
        { type: 'Transaction', id: transactionId }
      ],
    }),
    
    // ========== WALLET ENDPOINTS ==========
    
    // Get wallet balance
    getWalletBalance: builder.query({
      query: () => '/wallet/balance',
      providesTags: ['Wallet'],
    }),
    
    // Get wallet transactions
    getWalletTransactions: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/wallet/transactions?${searchParams.toString()}`;
      },
      providesTags: ['Wallet', 'Transaction'],
    }),
    
    // Send money
    sendMoney: builder.mutation({
      query: (transferData) => ({
        url: '/wallet/send-money',
        method: 'POST',
        body: transferData,
      }),
      invalidatesTags: ['Wallet', 'Transaction', 'Dashboard'],
    }),
    
    // ========== DASHBOARD ENDPOINT ==========
    
    // Get dashboard data
    getDashboard: builder.query({
      query: () => '/dashboard/index',
      providesTags: ['Dashboard'],
    }),
    
    // ========== NOTIFICATION ENDPOINTS ==========
    
    // Get notifications
    getNotifications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/notifications?${searchParams.toString()}`;
      },
      providesTags: ['Notification'],
    }),
    
    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    // ========== WHATSAPP ENDPOINTS ==========
    
    // Get WhatsApp account details and statistics
    getWhatsAppDetails: builder.query({
      query: () => '/whatsapp/details',
      providesTags: ['User'],
    }),
    
    // Toggle WhatsApp payments on/off
    toggleWhatsAppPayments: builder.mutation({
      query: (data) => ({
        url: '/whatsapp/toggle-payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Disconnect WhatsApp account
    disconnectWhatsApp: builder.mutation({
      query: () => ({
        url: '/whatsapp/disconnect-whatsapp',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // ========== TELEGRAM ENDPOINTS ==========
    
    // Get Telegram account details and statistics
    getTelegramDetails: builder.query({
      query: () => '/telegram/details',
      providesTags: ['User'],
    }),
    
    // Toggle Telegram payments on/off
    toggleTelegramPayments: builder.mutation({
      query: (data) => ({
        url: '/telegram/toggle-payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Disconnect Telegram account
    disconnectTelegram: builder.mutation({
      query: () => ({
        url: '/telegram/disconnect-telegram',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // ========== FACE RECOGNITION ENDPOINTS ==========
    
    // Get face recognition settings
    getFaceSettings: builder.query({
      query: () => '/face/luxand/settings',
      providesTags: ['User'],
    }),
    
    // Update face recognition settings
    updateFaceSettings: builder.mutation({
      query: (settings) => ({
        url: '/face/luxand/settings',
        method: 'POST',
        body: settings,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Enroll person with face photos
    enrollFace: builder.mutation({
      query: (formData) => ({
        url: '/face/luxand/enroll_person',
        method: 'POST',
        body: formData,
      }),
      extraOptions: { isFormData: true },
      invalidatesTags: ['User'],
    }),
    
    // Verify person with face photo
    verifyFace: builder.mutation({
      query: (formData) => ({
        url: '/face/luxand/verify_person',
        method: 'POST',
        body: formData,
      }),
      extraOptions: { isFormData: true },
    }),
    
    // Process face payment
    processFacePayment: builder.mutation({
      query: (formData) => ({
        url: '/face/luxand/face-pay',
        method: 'POST',
        body: formData,
      }),
      extraOptions: { isFormData: true },
      invalidatesTags: ['Transaction', 'Wallet'],
    }),
    
    // ========== TELEGRAM BOT ENDPOINTS ==========
    
    // Get transaction details for WebApp
    getTelegramTransactionDetails: builder.query({
      query: (token) => `/telegram/transaction-details?token=${token}`,
    }),
    
    // Verify PIN for Telegram WebApp
    verifyTelegramPin: builder.mutation({
      query: (pinData) => ({
        url: '/telegram/verify-pin',
        method: 'POST',
        body: pinData,
      }),
      invalidatesTags: ['Transaction', 'Wallet'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useRegisterMutation,
  useLoginMutation,
  useVerifyTokenQuery,
  
  // User hooks
  useGetCurrentUserQuery,
  useGetUserQuery,
  useSetPinMutation,
  useUpdatePinMutation,
  useUpdatePasswordMutation,
  useUpdateSettingsMutation,
  
  // Transaction hooks
  useGetTransactionsQuery,
  useGetTransactionQuery,
  
  // Wallet hooks
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useSendMoneyMutation,
  
  // Dashboard hooks
  useGetDashboardQuery,
  
  // Notification hooks
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  
  // WhatsApp hooks
  useGetWhatsAppDetailsQuery,
  useToggleWhatsAppPaymentsMutation,
  useDisconnectWhatsAppMutation,
  
  // Telegram hooks
  useGetTelegramDetailsQuery,
  useToggleTelegramPaymentsMutation,
  useDisconnectTelegramMutation,
  useGetTelegramTransactionDetailsQuery,
  useVerifyTelegramPinMutation,
  
  // Face recognition hooks
  useGetFaceSettingsQuery,
  useUpdateFaceSettingsMutation,
  useEnrollFaceMutation,
  useVerifyFaceMutation,
  useProcessFacePaymentMutation,
} = gestpayApi;
