import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../utils/translator";

const ios = Platform.OS === "ios";

export default function Notifications() {
  const router = useRouter();

  // Translate all text
  const notificationText = useTranslation("Notification");
  const ironSupplementText = useTranslation(
    "Time for your iron supplement, your glow up fuel"
  );
  const hydrationText = useTranslation(
    "8 glasses today, mama! Hydration = happy baby"
  );
  const walkTimeText = useTranslation(
    "Walk time! Even a few steps count toward strength"
  );
  const clinicVisitText = useTranslation(
    "Clinic visit tomorrow let's stay ready and steady"
  );

  // Sample notification data
  const notifications = [
    {
      id: "1",
      icon: "💊",
      message: ironSupplementText,
      bgColor: "#E8F5F3",
    },
    {
      id: "2",
      icon: "💧",
      message: hydrationText,
      bgColor: "#E8F5F3",
    },
    {
      id: "3",
      icon: "🚶‍♀️",
      message: walkTimeText,
      bgColor: "#E8F5F3",
    },
    {
      id: "4",
      icon: "🏥",
      message: clinicVisitText,
      bgColor: "#E8F5F3",
    },
    {
      id: "5",
      icon: "🏥",
      message: clinicVisitText,
      bgColor: "#E8F5F3",
    },
    {
      id: "6",
      icon: "🚶‍♀️",
      message: walkTimeText,
      bgColor: "#E8F5F3",
    },
    {
      id: "7",
      icon: "💧",
      message: hydrationText,
      bgColor: "#E8F5F3",
    },
    {
      id: "8",
      icon: "💊",
      message: ironSupplementText,
      bgColor: "#E8F5F3",
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className="mb-3"
      onPress={() => console.log("Notification pressed:", item.id)}
    >
      <View
        style={{
          backgroundColor: item.bgColor,
          paddingHorizontal: 16,
          paddingVertical: 20,
        }}
        className="flex-row items-center"
      >
        <Text style={{ fontSize: 24, marginRight: 12 }}>{item.icon}</Text>
        <Text className="text-[#293231] text-[15px] flex-1 leading-5">
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FCFCFC]">
      {/* Header */}
      <View
        className="bg-white border-b border-gray-100"
        style={{
          paddingTop: ios ? 60 : 40,
          paddingBottom: 16,
          paddingHorizontal: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        }}
      >
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={handleBack}
            className="absolute left-0"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#293231" />
          </TouchableOpacity>
          <Text className="text-[#293231] text-xl font-bold">
            {notificationText}
          </Text>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 8,
        }}
      />
    </View>
  );
}
