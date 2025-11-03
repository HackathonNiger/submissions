import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { gestpayApi } from './api/gestpayApi';
import authReducer from './slices/authSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [gestpayApi.reducerPath]: gestpayApi.reducer,
    auth: authReducer,
    toast: toastReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [gestpayApi.util.getRunningQueriesThunk.fulfilled],
      },
    }).concat(gestpayApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
