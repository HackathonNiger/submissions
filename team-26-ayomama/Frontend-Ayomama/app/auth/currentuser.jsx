import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useAuthStore from "../../store/useAuthStore";
import useAuthWorkerStore from "../../store/useAuthWorkerStore";
import { useTranslation } from "../../utils/translator";

const CurrentUser = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated: isMotherAuth,
    isLoading: isMotherLoading,
    refreshUser,
    logout: logoutMother,
  } = useAuthStore();
  const {
    worker,
    isAuthenticated: isWorkerAuth,
    isLoading: isWorkerLoading,
    refreshWorker,
    logout: logoutWorker,
  } = useAuthWorkerStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Determine which user type is authenticated
  const isHealthcareWorker = isWorkerAuth;
  const isAuthenticated = isMotherAuth || isWorkerAuth;
  const isLoading = isMotherLoading || isWorkerLoading;
  const currentUser = isHealthcareWorker ? worker : user;
  const logout = isHealthcareWorker ? logoutWorker : logoutMother;

  // Translate all text
  const welcomeBackText = useTranslation("Welcome Back");
  const accountReadyText = useTranslation("Your account is ready to continue");
  const emailText = useTranslation("Email:");
  const phoneText = useTranslation("Phone:");
  const languageText = useTranslation("Language:");
  const refreshButtonText = useTranslation("Refresh User Data");
  const goToHomeText = useTranslation("Go to Home");
  const switchAccountText = useTranslation("Want to switch account?");
  const logoutText = useTranslation("Logout");
  const refreshedText = useTranslation("Refreshed!");
  const dataUpdatedText = useTranslation("User data updated successfully");
  const welcomeText = useTranslation("Welcome!");
  const redirectingText = useTranslation("Redirecting to home...");
  const logoutTitleText = useTranslation("Logout");
  const logoutMessageText = useTranslation(
    "Are you sure you want to logout? You can login with another account."
  );
  const cancelText = useTranslation("Cancel");
  const loggedOutText = useTranslation("Logged Out");
  const seeSoonText = useTranslation("See you soon!");
  const loadingUserText = useTranslation("Loading user...");
  const noUserText = useTranslation("No user found. Please login.");
  const goToLoginText = useTranslation("Go to Login");

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const result = isHealthcareWorker
      ? await refreshWorker()
      : await refreshUser();
    setIsRefreshing(false);
    if (result?.success) {
      Toast.show({
        type: "success",
        text1: refreshedText,
        text2: dataUpdatedText,
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleGoToHome = () => {
    Toast.show({
      type: "success",
      text1: welcomeText,
      text2: redirectingText,
      position: "top",
      visibilityTime: 1500,
    });
    setTimeout(() => {
      // Navigate to appropriate dashboard based on user type
      if (isHealthcareWorker) {
        router.replace("/healthworker/dashboard");
      } else {
        router.replace("/(tabs)");
      }
    }, 1500);
  };

  const handleLogout = () => {
    Alert.alert(logoutTitleText, logoutMessageText, [
      {
        text: cancelText,
        style: "cancel",
      },
      {
        text: logoutText,
        style: "destructive",
        onPress: async () => {
          await logout();
          Toast.show({
            type: "info",
            text1: loggedOutText,
            text2: seeSoonText,
            position: "top",
            visibilityTime: 2000,
          });
          setTimeout(() => {
            // Navigate to appropriate login page based on user type
            if (isHealthcareWorker) {
              router.replace("/auth/healthcare/login");
            } else {
              router.replace("/auth/login");
            }
          }, 2000);
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFCFC]">
        <ActivityIndicator size="large" color="#006D5B" />
        <Text className="mt-2 text-gray-600">{loadingUserText}</Text>
      </View>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFCFC] p-6">
        <Text className="text-red-500 text-lg mb-4">{noUserText}</Text>
        <TouchableOpacity
          className="bg-[#006D5B] px-6 py-3 rounded-2xl"
          onPress={() => router.push("/Onboarding")}
        >
          <Text className="text-white font-semibold">{goToLoginText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFCFC] px-6">
      <View className="flex-1">
        {/* Logo */}
        <View className="mt-5 items-start">
          <Image
            source={require("../../assets/images/AyomamaLogo.png")}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-left mt-6 mb-2">
          {welcomeBackText},{" "}
          {isHealthcareWorker ? currentUser.fullName : currentUser.name}!
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-600 mb-10">{accountReadyText}</Text>

        {/* User Info Card */}
        <View className="w-full border border-gray-300 rounded-2xl px-4 py-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-500 w-20">{emailText}</Text>
            <Text className="text-gray-700 flex-1" numberOfLines={1}>
              {currentUser.email}
            </Text>
          </View>
          {currentUser.phone && (
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-500 w-20">{phoneText}</Text>
              <Text className="text-gray-700 flex-1">{currentUser.phone}</Text>
            </View>
          )}
          {isHealthcareWorker && currentUser.facilityName && (
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-500 w-20">Facility:</Text>
              <Text className="text-gray-700">{currentUser.facilityName}</Text>
            </View>
          )}
          <View className="flex-row items-center">
            <Text className="text-gray-500 w-20">{languageText}</Text>
            <Text className="text-gray-700 flex-1">
              {currentUser.preferredLanguages || "en"}
            </Text>
          </View>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          className="w-full border border-[#006D5B] rounded-2xl px-4 py-[14px] mb-4"
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator color="#006D5B" />
          ) : (
            <Text className="text-[#006D5B] text-center font-semibold text-base">
              {refreshButtonText}
            </Text>
          )}
        </TouchableOpacity>

        {/* Go to Home Button */}
        <TouchableOpacity
          className="bg-[#006D5B] py-5 rounded-2xl mt-2"
          onPress={handleGoToHome}
        >
          <Text className="text-white text-center font-bold text-base">
            {goToHomeText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer pinned */}
      <View className="flex-row justify-center items-center mb-16">
        <Text className="text-gray-600">{switchAccountText} </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-red-500 font-semibold">{logoutText}</Text>
        </TouchableOpacity>
      </View>

      {/* Toast component */}
      <Toast />
    </View>
  );
};

export default CurrentUser;
