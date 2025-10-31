import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "../../utils/translator";

const ios = Platform.OS === "ios";

export default function BabyDevelopment() {
  const router = useRouter();

  // Translate all text
  const titleText = useTranslation("Baby Development");
  const babySizeText = useTranslation("Your baby is the size of a lime");
  const weekMilestonesText = useTranslation("Week 18 Milestones");
  const milestone1Text = useTranslation("Your baby can now hear sounds 🎉");
  const milestone2Text = useTranslation(
    "Your baby's finger and toes are growing 🎉"
  );
  const milestone3Text = useTranslation("Your baby can move actively 🎉");
  const babyWeightText = useTranslation(
    "Your baby now weighs about 900g and is around 36cm long"
  );
  const healthTipText = useTranslation(
    "You might notice more pain this week, try gentle walk and keep hydrated"
  );
  const nutritionTipText = useTranslation(
    "Add fruit like pawpaw and vegetable like spinanach to your meal"
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-[#FCFCFC]">
      {/* Fixed Header */}
      <View
        className="px-6 flex-row items-center justify-between absolute top-0 left-0 right-0 z-10"
        style={{
          paddingTop: ios ? 64 : 76,
          paddingBottom: 16,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#293231" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-[#293231]">{titleText}</Text>

        <View className="w-12" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 140,
          paddingBottom: 40,
        }}
      >
        {/* Main Content Container */}
        <View className="px-6">
          {/* Main Card with Border */}
          <View
            className="bg-white rounded-3xl p-6 mb-6"
            style={{
              borderWidth: 2,
              borderColor: "#4FD1C5",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            {/* Header with emoji and text */}
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">🍋</Text>
              <Text className="text-lg font-semibold text-[#293231] flex-1">
                {babySizeText}
              </Text>
            </View>

            {/* Week Title */}
            <Text className="text-base font-bold text-[#293231] mb-4">
              {weekMilestonesText}
            </Text>

            {/* Baby Image */}
            <View className="items-center mb-6">
              <View
                className="bg-[#E0F7F4] rounded-3xl p-4"
                style={{
                  width: 200,
                  height: 240,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/infant.png")}
                  style={{
                    width: 160,
                    height: 200,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>

            {/* Milestones Box */}
            <View
              className="bg-[#FFF5F5] rounded-2xl p-4"
              style={{
                borderWidth: 1.5,
                borderColor: "#FED7D7",
              }}
            >
              {/* Milestone 1 */}
              <View className="flex-row items-start mb-3">
                <Text className="text-base mr-2">•</Text>
                <Text className="text-[#293231] text-base flex-1">
                  {milestone1Text}
                </Text>
              </View>

              {/* Milestone 2 */}
              <View className="flex-row items-start mb-3">
                <Text className="text-base mr-2">•</Text>
                <Text className="text-[#293231] text-base flex-1">
                  {milestone2Text}
                </Text>
              </View>

              {/* Milestone 3 */}
              <View className="flex-row items-start">
                <Text className="text-base mr-2">•</Text>
                <Text className="text-[#293231] text-base flex-1">
                  {milestone3Text}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Cards */}
          {/* Card 1 - Baby Weight */}
          <View
            className="bg-[#E6F7F5] rounded-2xl p-4 mb-4 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
          >
            <Text className="text-3xl mr-3">😊</Text>
            <Text className="text-[#293231] text-base flex-1 font-medium">
              {babyWeightText}
            </Text>
          </View>

          {/* Card 2 - Health Tip */}
          <View
            className="bg-[#E6F7F5] rounded-2xl p-4 mb-4 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
          >
            <Text className="text-3xl mr-3">😊</Text>
            <Text className="text-[#293231] text-base flex-1 font-medium">
              {healthTipText}
            </Text>
          </View>

          {/* Card 3 - Nutrition Tip */}
          <View
            className="bg-[#E6F7F5] rounded-2xl p-4 mb-4 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
          >
            <Text className="text-3xl mr-3">😊</Text>
            <Text className="text-[#293231] text-base flex-1 font-medium">
              {nutritionTipText}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
