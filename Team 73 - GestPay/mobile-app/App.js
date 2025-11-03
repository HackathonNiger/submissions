import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Provider } from 'react-redux';
import { store } from './src/store';
import AuthNavigator from "./src/navigation/AuthNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider, ToastContainer } from './src/components/Toast';

function loadFonts() {
  return Font.loadAsync({
    //Include inter and montserrat
    "SpaceGrotesk-Light": require("./assets/fonts/Space-Grotesk/SpaceGrotesk-Light.ttf"),
    "SpaceGrotesk-Regular": require("./assets/fonts/Space-Grotesk/SpaceGrotesk-Regular.ttf"),
    "SpaceGrotesk-Bold": require("./assets/fonts/Space-Grotesk/SpaceGrotesk-Bold.ttf"),
    "SpaceGrotesk-Medium": require("./assets/fonts/Space-Grotesk/SpaceGrotesk-Medium.ttf"),
    "SpaceGrotesk-SemiBold": require("./assets/fonts/Space-Grotesk/SpaceGrotesk-SemiBold.ttf"),
  });
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        // Add a small delay to ensure smooth animation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    //return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <ToastProvider>
        <SafeAreaProvider>
          <AuthNavigator />
          <ToastContainer />
        </SafeAreaProvider>
      </ToastProvider>
    </Provider>
  );
}
