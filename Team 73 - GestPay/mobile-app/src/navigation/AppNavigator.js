import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OnboardingScreen from "../screens/Auth/OnboardingScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import PinEntryScreen from "../screens/Auth/PinEntryScreen";
import CreatePinScreen from "../screens/Auth/CreatePinScreen";
import HomeScreen from "../screens/HomeScreen"; // Placeholder

import Header from "../components/molecules/Header";
import BottomNavBar from "../components/molecules/BottomNavbar";
import WalletScreen from "../screens/WalletScreen";
import AIChatScreen from "../screens/AIChatScreen";
import BiometricScreen from "../screens/BiometricScreen";
import SendMoneyScreen from "../screens/SendMoneyScreen";
import FacePaySetupScreen from "../screens/FaceSetupScreen";
import AddBeneficiaryScreen from "../screens/AddBeneficiaryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import TelegramPayScreen from "../screens/TelegramPayScreen";
import WhatsAppPayScreen from "../screens/WhatsAppPayScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
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
            header: () => (
              <Header
                title="Create Account"
                variant="back"
                navigation={navigation}
              />
            ),
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            header: () => (
              <Header
                title="Forgot Password"
                variant="back"
                navigation={navigation}
              />
            ),
          }}
        />
        <Stack.Screen
          name="PinEntry"
          component={PinEntryScreen}
          options={{
            header: () => (
              <Header
                title="Enter PIN"
                variant="back"
                navigation={navigation}
              />
            ),
          }}
        />
        <Stack.Screen
          name="CreatePin"
          component={CreatePinScreen}
          options={{
            header: () => (
              <Header
                title="Create PIN"
                variant="back"
                navigation={navigation}
              />
            ),
          }}
        />

        <Stack.Screen
          name="FaceSetupScreen"
          component={FacePaySetupScreen}
          
        />
      <Stack.Screen name="TelegramPay" component={TelegramPayScreen} />
      <Stack.Screen name="WhatsAppPay" component={WhatsAppPayScreen} />
      
        <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
         <Stack.Screen name="Settings" component={SettingsScreen} />
           <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="AddBeneficiary" component={AddBeneficiaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
