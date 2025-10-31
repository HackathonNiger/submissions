import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../utils/translator";

const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

export default function Learn() {
  const router = useRouter();

  // Translate all text
  const headerText1 = useTranslation("For every question and every worry,");
  const headerText2 = useTranslation("i will be your");
  const headerText3 = useTranslation("gentle AI companion");
  const smartChatText = useTranslation("Smart Chat");
  const communityText = useTranslation("Community");
  const communityDescText = useTranslation("share and learn new things.");
  const babyDevText = useTranslation("Baby Development");
  const babyDevDescText = useTranslation(
    "Learn more about the development of your child"
  );

  const handleSmartChat = () => {
    router.push("/chat/SmartChat");
  };

  const handleVoiceChat = () => {
    console.log("Voice Chat clicked");
    // TODO: Navigate to Voice Chat
  };

  const handleImageRecognition = () => {
    console.log("Image Recognition clicked");
    // TODO: Navigate to Image Recognition
  };

  const handleCommunity = () => {
    router.push("/community");
  };

  const handleBabyDevelopment = () => {
    router.push("/babyDevelopment/development");
  };

  return (
    <View className="flex-1 bg-[#FCFCFC]">
      <LinearGradient
        colors={["#B5FFFC", "#FFDEE9"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <View className="flex-1">
        <View
          className={`px-6 ${topMargin}`}
          style={{ paddingTop: ios ? 64 : 76 }}
        >
          {/* Header Text */}
          <Text className="text-2xl font-bold text-[#293231] mb-2">
            {headerText1}
          </Text>
          <Text className="text-2xl font-bold text-[#293231] mb-8">
            {headerText2} <Text className="text-[#FF7F50]">{headerText3}</Text>
          </Text>

          {/* Top Action Buttons Row */}
          <View className="flex-row items-center justify-between mb-4">
            {/* Smart Chat Button */}
            <TouchableOpacity
              onPress={handleSmartChat}
              className="bg-white/70 rounded-3xl px-6 py-4 flex-1 mr-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className="text-[#293231] font-semibold text-base text-center">
                {smartChatText}
              </Text>
            </TouchableOpacity>

            {/* Voice Button */}
            <TouchableOpacity
              onPress={handleVoiceChat}
              className="bg-white/70 rounded-full w-14 h-14 items-center justify-center mx-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="mic" size={24} color="#293231" />
            </TouchableOpacity>

            {/* Image Button */}
            <TouchableOpacity
              onPress={handleImageRecognition}
              className="bg-white/70 rounded-full w-14 h-14 items-center justify-center ml-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="image" size={24} color="#293231" />
            </TouchableOpacity>
          </View>

          {/* Main Cards Grid */}
          <View className="flex-row mb-4">
            {/* Community Card */}
            <TouchableOpacity
              onPress={handleCommunity}
              className="bg-white/80 rounded-3xl p-5 flex-1 mr-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                minHeight: 160,
              }}
            >
              <View className="w-12 h-12  items-center justify-center mb-3">
                <Ionicons name="people" size={24} color="black" />
              </View>
              <Text className="text-xl font-bold text-[#293231] mb-2">
                {communityText}
              </Text>
              <Text className="text-sm text-[#6B7280]">
                {communityDescText}
              </Text>
            </TouchableOpacity>

            {/* Baby Development Card */}
            <TouchableOpacity
              onPress={handleBabyDevelopment}
              className="bg-white/80 rounded-3xl p-5 flex-1 ml-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                minHeight: 160,
              }}
            >
              <View className="w-12 h-12  items-center justify-center mb-3">
                <Ionicons name="happy" size={24} color="black" />
              </View>
              <Text className="text-xl font-bold text-[#293231] mb-2">
                {babyDevText}
              </Text>
              <Text className="text-sm text-[#6B7280]">{babyDevDescText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
