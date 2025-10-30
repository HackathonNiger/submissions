// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import SplashScreen from "./pages/Auth/SplashScreen";   // 👈 shows ContentPage first
// import Login from "./pages/Auth/Login";     // 👈 login
// import Signup from "./pages/Auth/Signup";   // 👈 signup
// import Home from "./pages/Home/Home";                   // 👈 landing page (Menue)

// import RoleSelect from "./pages/Roles/RoleSelect";
// import Scan from "./pages/Scan/Scan";
// import Verify from "./pages/Verification/Verify";

// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { StyleSheet } from "react-native";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
//           {/* Splash shows ContentPage first */}
//           <Stack.Screen name="Splash" component={SplashScreen} />

//           {/* Auth Screens */}
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="Signup" component={Signup} />

//           {/* After successful login/signup */}
//           <Stack.Screen name="Home" component={Home} />

//           {/* Other app flows */}
//           <Stack.Screen name="RoleSelect" component={RoleSelect} />
//           <Stack.Screen name="Scan" component={Scan} />
//           <Stack.Screen name="Verify" component={Verify} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   app: {
//     flex: 1,
//   },
// });

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

import SplashScreen from "./pages/Auth/SplashScreen";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import RoleSelect from "./pages/Roles/RoleSelect";
import Scan from "./pages/Scan/Scan";
import Verify from "./pages/Verification/Verify";
import ScanningScreen from "./pages/Scan/ScanningScreen";

global.__DEV_MODE__ = true; // still building without backend

const Stack = createNativeStackNavigator();

// ✅ Temporary Error Boundary
const SafeHome = (props) => {
  try {
    return <Home {...props} />;
  } catch (error) {
    console.error("Home screen error:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>⚠️ Home screen crashed.</Text>
        <Text>{String(error.message || error)}</Text>
      </View>
    );
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={SafeHome} />
          <Stack.Screen name="RoleSelect" component={RoleSelect} />
          <Stack.Screen name="Scan" component={Scan} />
          <Stack.Screen name="Verify" component={Verify} />
          <Stack.Screen name="ScanningScreen" component={ScanningScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
});
