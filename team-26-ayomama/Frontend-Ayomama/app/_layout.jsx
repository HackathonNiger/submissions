import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "../global.css";
import useAuthStore from "../store/useAuthStore";
import useAuthWorkerStore from "../store/useAuthWorkerStore";
import useTranslatorStore from "../store/useTranslatorStore";

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeWorkerAuth = useAuthWorkerStore(
    (state) => state.initializeAuth
  );
  const initializeTranslator = useTranslatorStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state on app load (for both mothers and workers)
    initializeAuth();
    initializeWorkerAuth();

    // Initialize translator (load cached translations and language preference)
    initializeTranslator();
  }, []);

  return (
    <>
      <StatusBar barStyle="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Onboarding" />
        <Stack.Screen name="AccountSelection" />
        <Stack.Screen name="auth/currentuser" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/healthcare/login" />
        <Stack.Screen name="auth/healthcare/signup" />
        <Stack.Screen name="info/InfoCarousel" />
        <Stack.Screen name="info/LanguageStep" />
        <Stack.Screen name="info/InformationStep" />
        <Stack.Screen name="info/AntenatalStep" />
        <Stack.Screen name="info/NotificationStep" />
        <Stack.Screen name="healthinfo/info" />
        <Stack.Screen name="healthinfo/HealthInfoStep" />
        <Stack.Screen name="healthworker/dashboard" />
        <Stack.Screen name="healthworker/addPatient" />
        <Stack.Screen name="healthworker/logVisit" />
        <Stack.Screen name="healthworker/profile" />
        <Stack.Screen name="profile/EditProfile" />
        <Stack.Screen name="profile/ChangeLanguage" />
        <Stack.Screen name="profile/Security" />
        <Stack.Screen name="chat/SmartChat" />
        <Stack.Screen name="community/index" />
        <Stack.Screen name="healthworker/motherInfo" />
        <Stack.Screen name="babyDevelopment/development" />
        <Stack.Screen name="updateVitals/update" />
        <Stack.Screen name="visit/visitInput" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
