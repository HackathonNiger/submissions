import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  selectAuth, 
  selectUser, 
  selectIsAuthenticated, 
  selectIsLoading,
  logout,
  hydrateAuth,
  setAuthData 
} from '../lib/slices/authSlice';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetCurrentUserQuery,
  useVerifyTokenQuery 
} from '../lib/api/gestpayApi';
import { tokenUtils } from '../lib/utils/tokenUtils';
import { useToast } from './useToast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  
  // Selectors
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  
  // Debug: Log token state
  useEffect(() => {
    const cookieToken = tokenUtils.getToken();
    console.log('Auth Debug:', {
      reduxToken: auth.token,
      cookieToken: cookieToken,
      isAuthenticated,
      user: user?.email
    });
  }, [auth.token, isAuthenticated, user]);
  
  // Ensure auth state is hydrated on mount
  useEffect(() => {
    if (!auth.token) {
      const cookieToken = tokenUtils.getToken();
      if (cookieToken) {
        console.log('Hydrating auth from cookies...');
        dispatch(hydrateAuth());
      }
    }
  }, [auth.token, dispatch]);
  
  // Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  
  // Queries - Skip if no token available
  const { 
    data: currentUser, 
    isLoading: isUserLoading,
    refetch: refetchUser 
  } = useGetCurrentUserQuery(undefined, {
    skip: !auth.token || !isAuthenticated,
  });
  
  const { 
    data: tokenVerification, 
    isLoading: isVerifyingToken 
  } = useVerifyTokenQuery(undefined, {
    skip: !auth.token,
  });

  // Login function
  const login = async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      
      console.log('Login result:', result);
      
      // Ensure token is stored immediately
      if (result.token) {
        // Set auth data immediately in Redux (this also saves to localStorage)
        dispatch(setAuthData({
          token: result.token,
          user: result.data
        }));
        
        console.log('Token set in Redux immediately');
        
        // Refetch user data after a short delay to ensure token is available
        setTimeout(() => {
          console.log('Refetching user data...');
          refetchUser();
        }, 100);
      }
      
      toast.success('Login successful!', 'Welcome back');
      
      // Small delay before redirect to ensure state is updated
      setTimeout(() => {
        // Redirect based on user role
        const userRole = result.data.role;
        if (userRole === 'merchant') {
          router.push('/a/dashboard');
        } else {
          router.push('/a/dashboard');
        }
      }, 200);
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage, 'Login Failed');
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const result = await registerMutation(userData).unwrap();
      
      console.log('Register result:', result);
      
      // Ensure token is stored immediately
      if (result.token) {
        // For registration, the user data structure might be different
        const userData = result.data || {
          id: result.data?.user_id,
          username: result.data?.username,
          email: result.data?.email
        };
        
        // Set auth data immediately in Redux (this also saves to localStorage)
        dispatch(setAuthData({
          token: result.token,
          user: userData
        }));
        
        console.log('Registration token set in Redux immediately');
      }
      
      toast.success('Registration successful!', 'Welcome to GestPay');
      
      // Redirect to dashboard
      router.push('/a/dashboard');
      
      return result;
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, 'Registration Failed');
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have been logged out', 'Goodbye');
    router.push('/sign-in');
  };

  // Check if user is authenticated and token is valid
  const isValidSession = isAuthenticated && !isVerifyingToken && tokenVerification?.success;

  return {
    // State
    user: currentUser?.data || user,
    isAuthenticated: isValidSession,
    isLoading: isLoading || isLoginLoading || isRegisterLoading || isUserLoading,
    isVerifyingToken,
    
    // Actions
    login,
    register,
    logout: handleLogout,
    refetchUser,
    
    // Loading states
    isLoginLoading,
    isRegisterLoading,
    isUserLoading,
  };
};
