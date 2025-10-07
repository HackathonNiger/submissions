import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth screens
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import PinEntryScreen from '../screens/Auth/PinEntryScreen';
import CreatePinScreen from '../screens/Auth/CreatePinScreen';

// Main app screens
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import AIChatScreen from '../screens/AIChatScreen';
import BiometricScreen from '../screens/BiometricScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import FacePaySetupScreen from '../screens/FaceSetupScreen';
import AddBeneficiaryScreen from '../screens/AddBeneficiaryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TelegramPayScreen from '../screens/TelegramPayScreen';
import WhatsAppPayScreen from '../screens/WhatsAppPayScreen';

// Components
import Header from '../components/molecules/Header';
import BottomNavBar from '../components/molecules/BottomNavbar';

// Redux
import { selectIsAuthenticated, selectIsInitialized } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import theme from '../utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Loading screen component
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.colors.background 
  }}>
    <ActivityIndicator size="large" color={theme.colors.accent} />
  </View>
);

// Main app tabs (protected)
const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomNavBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        header: () => <Header title="Home" variant="default" />,
      }}
    />
    <Tab.Screen
      name="Wallet"
      component={WalletScreen}
      options={{
        header: () => <Header title="Transactions" variant="default" />,
      }}
    />
    <Tab.Screen
      name="Biometric"
      component={BiometricScreen}
      options={{
        header: () => <Header title="Profile" variant="default" />,
      }}
    />
    <Tab.Screen
      name="AIChat"
      component={AIChatScreen}
      options={{
        header: () => <Header title="Settings" variant="default" />,
      }}
    />
  </Tab.Navigator>
);

// Auth stack (public)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{
        header: () => <Header title="Welcome" variant="default" />,
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        header: () => <Header title="Sign In" variant="default" />,
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        header: () => <Header title="Create Account" variant="back" />,
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{
        header: () => <Header title="Forgot Password" variant="back" />,
      }}
    />
    <Stack.Screen
      name="PinEntry"
      component={PinEntryScreen}
      options={{
        header: () => <Header title="Enter PIN" variant="back" />,
      }}
    />
    <Stack.Screen
      name="CreatePin"
      component={CreatePinScreen}
      options={{
        header: () => <Header title="Create PIN" variant="back" />,
      }}
    />
  </Stack.Navigator>
);

// Main app stack (protected)
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="AddBeneficiary" component={AddBeneficiaryScreen} />
    <Stack.Screen name="FaceSetupScreen" component={FacePaySetupScreen} />
    <Stack.Screen name="TelegramPay" component={TelegramPayScreen} />
    <Stack.Screen name="WhatsAppPay" component={WhatsAppPayScreen} />
  </Stack.Navigator>
);

// Main navigator with authentication logic
const AuthNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    // Initialize authentication on app start
    authService.initializeAuth();
  }, []);

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AuthNavigator;
