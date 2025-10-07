'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../lib/store';
import { hydrateAuth } from '../../lib/slices/authSlice';

function AuthHydrator({ children }) {
  useEffect(() => {
    // Hydrate auth state from localStorage on client-side
    store.dispatch(hydrateAuth());
  }, []);
  
  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
      </AuthHydrator>
    </Provider>
  );
}
