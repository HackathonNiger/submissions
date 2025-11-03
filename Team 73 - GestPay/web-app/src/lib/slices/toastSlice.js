import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info', // success, error, warning, info
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        createdAt: Date.now(),
      };
      state.toasts.push(toast);
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;

// Selectors
export const selectToasts = (state) => state.toast.toasts;

export default toastSlice.reducer;
