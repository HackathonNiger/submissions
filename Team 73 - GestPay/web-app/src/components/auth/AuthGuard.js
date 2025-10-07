'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectToken, hydrateAuth } from '../../lib/slices/authSlice';
import { tokenUtils } from '../../lib/utils/tokenUtils';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const reduxToken = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthGuard: Initializing authentication...');
      
      // Check for token in cookies/localStorage
      const cookieToken = tokenUtils.getToken();
      
      console.log('AuthGuard Debug:', {
        reduxToken: reduxToken ? 'present' : 'missing',
        cookieToken: cookieToken ? 'present' : 'missing',
        isAuthenticated
      });

      // If we have a token in cookies but not in Redux, hydrate the state
      if (cookieToken && !reduxToken) {
        console.log('AuthGuard: Hydrating auth state from cookies...');
        dispatch(hydrateAuth());
        
        // Wait a bit for the state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setIsHydrated(true);
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch, reduxToken, isAuthenticated]);

  useEffect(() => {
    // Only check authentication after hydration is complete
    if (isHydrated && !isLoading) {
      const cookieToken = tokenUtils.getToken();
      
      if (!cookieToken && !isAuthenticated) {
        console.log('AuthGuard: No valid token found, redirecting to login...');
        router.push('/sign-in');
        return;
      }
      
      console.log('AuthGuard: User is authenticated');
    }
  }, [isHydrated, isLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show content only if authenticated
  if (isAuthenticated || tokenUtils.getToken()) {
    return children;
  }

  // Return null while redirecting
  return null;
}
