import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

const LogIn = () => {
  const router = useRouter();
  const { login, isLoading, hasCompletedProfile } = useAuthStore();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Translate all text
  const titleText = useTranslation("Log In to Your Account");
  const subtitleText = useTranslation("Log in to continue your experience");
  const emailPlaceholder = useTranslation("Email");
  const passwordPlaceholder = useTranslation("Password");
  const loginButtonText = useTranslation("Log In");
  const noAccountText = useTranslation("Don't have an account?");
  const signUpText = useTranslation("Sign up");
  const emailRequiredText = useTranslation("Email is required");
  const passwordRequiredText = useTranslation("Password is required");
  const validEmailText = useTranslation("Please enter a valid email");
  const passwordLengthText = useTranslation(
    "Password must be at least 6 characters"
  );
  const loginSuccessText = useTranslation("Login Successful!");
  const welcomeBackText = useTranslation("Welcome back");
  const loginFailedText = useTranslation("Login Failed");
  const invalidCredentialsText = useTranslation("Invalid credentials");
  const switchAccountText = useTranslation("Want to switch account type?");
  const clickHereText = useTranslation("Click here");

  const handleLogIn = async () => {
    // Validation
    if (!email) {
      setError(emailRequiredText);
      return;
    }

    if (!password) {
      setError(passwordRequiredText);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(validEmailText);
      return;
    }

    if (password.length < 6) {
      setError(passwordLengthText);
      return;
    }

    setError("");

    // Call login API with lowercase email
    const result = await login(email.toLowerCase().trim(), password);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: loginSuccessText,
        text2: result.message || welcomeBackText,
        position: "top",
        visibilityTime: 2000,
      });

      // Check if user has completed profile setup
      setTimeout(() => {
        if (hasCompletedProfile()) {
          // User has completed onboarding, go straight to main app
          router.replace("/(tabs)");
        } else {
          // User needs to complete onboarding
          router.replace("/info/InfoCarousel");
        }
      }, 2000);
    } else {
      setError(result.error || "Failed to login");
      Toast.show({
        type: "error",
        text1: loginFailedText,
        text2: result.error || invalidCredentialsText,
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Text className="text-2xl font-bold text-left mt-6 mb-4">
            {titleText}
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-600 mb-10">{subtitleText} </Text>

          {/* Email Input */}
          <TextInput
            placeholder={emailPlaceholder}
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            className="w-full border border-gray-300 rounded-2xl px-4 py-[14px] mb-4"
            keyboardType="email-address"
            editable={!isLoading}
          />
          {/* Password Input */}
          <View className="relative mb-4">
            <TextInput
              placeholder={passwordPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              className="w-full border border-gray-300 rounded-2xl px-4 py-[14px] pr-12"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[14px]"
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 mt-2 text-sm">{error}</Text>
          ) : null}

          {/* LogIn Button */}
          <TouchableOpacity
            className="bg-[#006D5B] py-5 rounded-2xl mt-6"
            onPress={handleLogIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-bold text-base">
                {loginButtonText}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer pinned */}
        <View className="mb-16">
          <View className="flex-row justify-center items-center mb-4">
            <Text className="text-gray-600">{noAccountText} </Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/signup")}
              disabled={isLoading}
            >
              <Text className="text-[#006D5B] font-semibold">{signUpText}</Text>
            </TouchableOpacity>
          </View>

          {/* Switch Account Type */}
          <TouchableOpacity
            onPress={() => router.push("/AccountSelection?action=login")}
            disabled={isLoading}
            className="flex-row items-center justify-center bg-[#F0F9FF] px-4 py-3 rounded-xl"
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={20}
              color="#006D5B"
            />
            <Text className="text-gray-600 ml-2">{switchAccountText} </Text>
            <Text className="text-[#006D5B] font-semibold">
              {clickHereText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toast component */}
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LogIn;
