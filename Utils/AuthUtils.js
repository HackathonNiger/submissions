// // utils/AuthUtils.js
// import { Alert } from 'react-native';
// import { loginUser, signupUser, passkeyLogin } from '../Api/AuthApi';

// // --- Email/Password Login ---
// export const handleLogin = async ({ email, password, navigation }) => {
//   if (!email || !password) {
//     Alert.alert("Error", "Please enter both email and password");
//     return;
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     Alert.alert("Invalid Email", "Please enter a valid email address");
//     return;
//   }

//   if (password.length < 6) {
//     Alert.alert("Weak Password", "Password must be at least 6 characters long");
//     return;
//   }

//   try {
//     const data = await loginUser(email, password);
//     console.log("Login successful:", data);
//     navigation.replace("Home");
//   } catch (err) {
//     Alert.alert("Login failed", err.message);
//   }
// };

// // --- Signup ---
// export const handleSignup = async ({ name, email, password, navigation }) => {
//   if (!name || !email || !password) {
//     Alert.alert("Error", "Please fill all the fields");
//     return;
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     Alert.alert("Invalid Email", "Please enter a valid email address");
//     return;
//   }

//   if (password.length < 6) {
//     Alert.alert("Weak Password", "Password must be at least 6 characters long");
//     return;
//   }

//   try {
//     const data = await signupUser(name, email, password);
//     console.log("Signup successful:", data);
//     navigation.replace("Login");
//   } catch (err) {
//     Alert.alert("Signup failed", err.message);
//   }
// };

// // --- Biometric Login (Web fallback) ---
// export const handleBiometricLogin = async (navigation) => {
//   Alert.alert("Not Available", "Biometric authentication is not supported on web.");
// };

// // --- Passkey Login ---
// export const handlePasskeyLogin = async (navigation) => {
//   try {
//     const data = await passkeyLogin(); // call backend passkey API
//     console.log("Passkey login response:", data);

//     if (data?.success) {
//       navigation.replace("Home");
//     } else {
//       Alert.alert("Failed", data?.message || "Passkey login failed.");
//     }
//   } catch (error) {
//     console.log(error);
//     Alert.alert("Error", "Something went wrong during passkey login.");
//   }
// };


import { Alert } from "react-native";
import { loginUser, signupUser, passkeyLogin } from "../Api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * --------------------------
 * EMAIL / PASSWORD LOGIN
 * --------------------------
 */
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
    // ✅ MOCK MODE (for local testing)
    if (global.__DEV_MODE__) {
      console.log("🧪 Mock login: skipping backend call");

      // 🔍 Try to retrieve name from previous signup
      const existingUserData = await AsyncStorage.getItem("user");
      const savedUser = existingUserData ? JSON.parse(existingUserData) : null;

      const mockUser = {
        name: savedUser?.name || "User", // ✅ Use saved name if exists
        email,
        role: savedUser?.role || "Patient",
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setTimeout(() => navigation.replace("Home", mockUser), 800);
      return;
    }

    // ✅ REAL BACKEND LOGIN
    const response = await loginUser(email, password);
    console.log("Login successful:", response);

    const userData = {
      name: response?.user?.name || response?.name || "User",
      email: response?.user?.email || email,
      role: response?.user?.role || "Patient",
    };

    await AsyncStorage.setItem("user", JSON.stringify(userData));
    navigation.replace("Home", userData);
  } catch (err) {
    console.error("Login error:", err);
    Alert.alert("Login failed", err.message || "Something went wrong during login.");
  }
};

/**
 * --------------------------
 * SIGNUP
 * --------------------------
 */
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
    if (global.__DEV_MODE__) {
      console.log("🧪 Mock signup: skipping backend call");

      const mockUser = {
        name,
        email,
        role: "Patient",
      };

      // ✅ Save the user data locally so login can access it later
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));

      setTimeout(() => navigation.replace("Login"), 800);
      return;
    }

    const response = await signupUser(name, email, password);
    console.log("Signup successful:", response);

    const userData = {
      name: response?.user?.name || name,
      email: response?.user?.email || email,
      role: response?.user?.role || "Patient",
    };

    await AsyncStorage.setItem("user", JSON.stringify(userData));
    Alert.alert("Success", "Account created successfully! Please log in.");
    navigation.replace("Login");
  } catch (err) {
    console.error("Signup error:", err);
    Alert.alert("Signup failed", err.message || "Something went wrong during signup.");
  }
};

/**
 * --------------------------
 * BIOMETRIC LOGIN
 * --------------------------
 */
export const handleBiometricLogin = async (navigation) => {
  if (global.__DEV_MODE__) {
    console.log("🧪 Mock biometric login");
    Alert.alert("Mock Login", "Biometric login simulated.");

    const mockUser = {
      name: "Biometric User",
      email: "biometric@example.com",
      role: "Patient",
    };

    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    setTimeout(() => navigation.replace("Home", mockUser), 800);
    return;
  }

  Alert.alert("Not Available", "Biometric authentication is not supported on web.");
};

/**
 * --------------------------
 * PASSKEY LOGIN
 * --------------------------
 */
export const handlePasskeyLogin = async (navigation) => {
  try {
    if (global.__DEV_MODE__) {
      console.log("🧪 Mock passkey login");
      Alert.alert("Mock Login", "Passkey login simulated.");

      const mockUser = {
        name: "Passkey User",
        email: "passkey@example.com",
        role: "Patient",
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setTimeout(() => navigation.replace("Home", mockUser), 800);
      return;
    }

    const response = await passkeyLogin();
    console.log("Passkey login response:", response);

    if (response?.success) {
      const userData = {
        name: response?.user?.name || "User",
        email: response?.user?.email || "unknown@example.com",
        role: response?.user?.role || "Patient",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      navigation.replace("Home", userData);
    } else {
      Alert.alert("Failed", response?.message || "Passkey login failed.");
    }
  } catch (error) {
    console.error("Passkey login error:", error);
    Alert.alert("Error", "Something went wrong during passkey login.");
  }
};
