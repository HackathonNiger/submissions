import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../utils/translator";

const AccountSelection = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [authAction, setAuthAction] = useState("signup");

  // Translate all text
  const chooseAccountText = useTranslation("Choose your Account");
  const healthcareWorkerText = useTranslation("Health care worker");
  const healthcareDescText = useTranslation(
    "Manage your patient effectively, you can check how well they are doing."
  );
  const motherText = useTranslation("Mother");
  const motherDescText = useTranslation(
    "Track your baby health while still in the womb."
  );
  const proceedText = useTranslation("Proceed");

  // Get auth action from route params
  useEffect(() => {
    if (params.action) {
      setAuthAction(params.action);
    }
  }, [params.action]);

  const handleAccountSelect = (accountType) => {
    setSelectedAccount(accountType);
  };

  const handleProceed = () => {
    if (!selectedAccount) return;

    if (selectedAccount === "healthcare") {
      // Navigate to healthcare auth pages
      if (authAction === "signup") {
        router.push("/auth/healthcare/signup");
      } else {
        router.push("/auth/healthcare/login");
      }
    } else {
      // Navigate to mother auth pages
      if (authAction === "signup") {
        router.push("/auth/signup");
      } else {
        router.push("/auth/login");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Gradient Background - Same as Onboarding */}
      <LinearGradient
        colors={["#B5FFFC", "#FFDEE9"]}
        style={{
          height: "120%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <View className="flex-1">
        {/* Ayomama Logo */}
        <View className="mt-5 ml-6 items-start mb-8">
          <Image
            source={require("../assets/images/AyomamaLogo.png")}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 px-6">
          {/* Title */}
          <Text className="text-2xl font-bold text-[#293231] mb-10">
            {chooseAccountText}
          </Text>

          {/* Healthcare Worker Card */}
          <TouchableOpacity
            onPress={() => handleAccountSelect("healthcare")}
            className="mb-6"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#BCF2E9", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 28,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                overflow: "hidden",
              }}
            >
              <View className="bg-white/60 backdrop-blur-sm">
                <View className="p-6 flex-row items-center">
                  {/* Healthcare Worker Image */}
                  <View
                    className="mr-5 rounded-2xl overflow-hidden bg-white"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                    }}
                  >
                    <Image
                      source={require("../assets/images/healthcare.png")}
                      className="w-20 h-20"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Text Content */}
                  <View className="flex-1 pr-2">
                    <Text className="text-[17px] font-bold text-[#293231] mb-2">
                      {healthcareWorkerText}
                    </Text>
                    <Text className="text-[13px] text-gray-700 leading-5">
                      {healthcareDescText}
                    </Text>
                  </View>

                  {/* Radio Button */}
                  <View
                    className={`w-7 h-7 rounded-full border-[2.5px] ml-2 items-center justify-center ${
                      selectedAccount === "healthcare"
                        ? "border-[#006D5B] bg-[#006D5B]/10"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedAccount === "healthcare" && (
                      <View className="w-3.5 h-3.5 rounded-full bg-[#006D5B]" />
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mother Card */}
          <TouchableOpacity
            onPress={() => handleAccountSelect("mother")}
            className="mb-12"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#BCF2E9", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 28,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                overflow: "hidden",
              }}
            >
              <View className="bg-white/60 backdrop-blur-sm">
                <View className="p-6 flex-row items-center">
                  {/* Mother Image */}
                  <View
                    className="mr-5 rounded-2xl overflow-hidden bg-white"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                    }}
                  >
                    <Image
                      source={require("../assets/images/Pregnantblackwoman.png")}
                      className="w-20 h-20"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Text Content */}
                  <View className="flex-1 pr-2">
                    <Text className="text-[17px] font-bold text-[#293231] mb-2">
                      {motherText}
                    </Text>
                    <Text className="text-[13px] text-gray-700 leading-5">
                      {motherDescText}
                    </Text>
                  </View>

                  {/* Radio Button */}
                  <View
                    className={`w-7 h-7 rounded-full border-[2.5px] ml-2 items-center justify-center ${
                      selectedAccount === "mother"
                        ? "border-[#006D5B] bg-[#006D5B]/10"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedAccount === "mother" && (
                      <View className="w-3.5 h-3.5 rounded-full bg-[#006D5B]" />
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Spacer to push button to bottom */}
          <View className="flex-1" />

          {/* Proceed Button */}
          <View className="mb-10">
            <TouchableOpacity
              className={`py-5 rounded-3xl ${
                selectedAccount ? "bg-[#006D5B]" : "bg-gray-400"
              }`}
              style={{
                shadowColor: selectedAccount ? "#006D5B" : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedAccount ? 0.3 : 0.1,
                shadowRadius: 8,
              }}
              onPress={handleProceed}
              disabled={!selectedAccount}
              activeOpacity={0.85}
            >
              <Text className="text-white text-center font-bold text-[17px]">
                {proceedText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountSelection;
