// utils/AuthUtils.native.js
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { loginUser, signupUser, passkeyLogin } from '../Api/AuthApi';

// --- Email/Password Login ---
export const handleLogin = async ({ email, password, navigation }) => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter both email and password");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Invalid Email", "Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Weak Password", "Password must be at least 6 characters long");
    return;
  }

  try {
    const data = await loginUser(email, password);
    console.log("Login successful:", data);
    navigation.replace("Home");
  } catch (err) {
    Alert.alert("Login failed", err.message);
  }
};

// --- Signup ---
export const handleSignup = async ({ name, email, password, navigation }) => {
  if (!name || !email || !password) {
    Alert.alert("Error", "Please fill all the fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Invalid Email", "Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Weak Password", "Password must be at least 6 characters long");
    return;
  }

  try {
    const data = await signupUser(name, email, password);
    console.log("Signup successful:", data);
    navigation.replace("Login");
  } catch (err) {
    Alert.alert("Signup failed", err.message);
  }
};

// --- Biometric Login ---
export const handleBiometricLogin = async (navigation) => {
  try {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) {
      Alert.alert("Not Available", "Biometric authentication is not available on this device.");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("No Biometrics", "No fingerprints or Face ID registered.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometric",
      fallbackLabel: "Enter Passcode",
    });

    if (result.success) {
      console.log("Biometric login successful");
      navigation.replace("Home");
    } else {
      Alert.alert("Failed", "Biometric authentication failed.");
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Something went wrong during biometric authentication.");
  }
};

// --- Passkey Login ---
export const handlePasskeyLogin = async (navigation) => {
  try {
    const data = await passkeyLogin(); // call your passkey API endpoint
    console.log("Passkey login response:", data);

    if (data && data.success) {
      console.log("Passkey login successful");
      navigation.replace("Home");
    } else {
      Alert.alert("Failed", data?.message || "Passkey login failed.");
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Something went wrong during passkey login.");
  }
};
