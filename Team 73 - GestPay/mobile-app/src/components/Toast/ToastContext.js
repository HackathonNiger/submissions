import React, { createContext, useContext, useReducer } from 'react';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast actions
const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CLEAR_ALL: 'CLEAR_ALL',
};

// Initial state
const initialState = {
  toasts: [],
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    case TOAST_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

// Create context
const ToastContext = createContext();

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Generate unique ID
  const generateId = () => Date.now() + Math.random();

  // Add toast
  const addToast = (message, type = TOAST_TYPES.INFO, options = {}) => {
    const id = generateId();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      position: options.position || 'top',
      persistent: options.persistent || false,
      ...options,
    };

    dispatch({ type: TOAST_ACTIONS.ADD_TOAST, payload: toast });

    // Auto remove toast if not persistent
    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  };

  // Remove toast
  const removeToast = (id) => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
  };

  // Clear all toasts
  const clearAll = () => {
    dispatch({ type: TOAST_ACTIONS.CLEAR_ALL });
  };

  // Convenience methods
  const success = (message, options) => addToast(message, TOAST_TYPES.SUCCESS, options);
  const error = (message, options) => addToast(message, TOAST_TYPES.ERROR, options);
  const warning = (message, options) => addToast(message, TOAST_TYPES.WARNING, options);
  const info = (message, options) => addToast(message, TOAST_TYPES.INFO, options);

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
