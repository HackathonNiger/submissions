import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuthWorkerStore from "../../store/useAuthWorkerStore";
import { useTranslation } from "../../utils/translator";

const isIOS = Platform.OS === "ios";

export default function HealthcareDashboard() {
  const router = useRouter();
  const { worker } = useAuthWorkerStore();
  const nurseName = worker?.fullName || "Healthcare Worker";

  // Translate all text
  const monitorText = useTranslation("Monitor");
  const caringForMothersText = useTranslation(
    "You are caring for 28 mother this week"
  );
  const safeText = useTranslation("Safe");
  const urgentText = useTranslation("Urgent");
  const addPatientText = useTranslation("Add Patient");
  const logVisitText = useTranslation("Log visit");
  const mothersUnderCareText = useTranslation("Mothers Under Your Care");
  const viewText = useTranslation("View");
  const nextVisitText = useTranslation("Next visit:");
  const lastVisitText = useTranslation("Last visit:");
  const viewAllText = useTranslation("View all");
  const riskyDistributionText = useTranslation("Risky distribution");
  const currentStatusText = useTranslation(
    "Current status of all registered mothers"
  );
  const totalText = useTranslation("Total");
  const mothersNeedingAttentionText = useTranslation(
    "Mothers Needing Attention"
  );
  const weeklyVisitProgressText = useTranslation("Weekly Visit Progress");
  const visitsCompletedText = useTranslation("Visits Completed");
  const newRegistrationText = useTranslation("New Registration");
  const ofWeeklyTargetText = useTranslation("% of weekly target");

  // Mock data
  const stats = {
    safe: 28,
    monitor: 13,
    urgent: 6,
  };

  const mothersUnderCare = [
    {
      id: 1,
      name: "Amara Okafor",
      weeks: "24 weeks pregnant",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
      status: "safe",
    },
    {
      id: 2,
      name: "Amara Okafor",
      weeks: "24 weeks pregnant",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
      status: "monitor",
    },
    {
      id: 3,
      name: "Amara Okafor",
      weeks: "24 weeks pregnant",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
      status: "urgent",
    },
  ];

  const mothersNeedingAttention = [
    {
      id: 1,
      name: "Amara Okafor",
      issue: "High blood pressure detected",
      weeks: "38 weeks",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
    },
    {
      id: 2,
      name: "Amara Okafor",
      issue: "High blood pressure detected",
      weeks: "38 weeks",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
    },
    {
      id: 3,
      name: "Amara Okafor",
      issue: "High blood pressure detected",
      weeks: "38 weeks",
      nextVisit: "Oct 8, 2025",
      lastVisit: "Oct 8, 2025",
    },
  ];

  const weeklyProgress = {
    visitsCompleted: 42,
    newRegistration: 42,
    visitsTarget: 84,
    registrationTarget: 64,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "#06D6A0";
      case "monitor":
        return "#FFD166";
      case "urgent":
        return "#EF476F";
      default:
        return "#06D6A0";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "safe":
        return "health-and-safety";
      case "monitor":
        return "eye-outline";
      case "urgent":
        return "alert";
      default:
        return "checkmark-circle";
    }
  };

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header */}
      <View
        className="bg-white"
        style={{
          paddingTop: isIOS ? 50 : StatusBar.currentHeight || 24,
          paddingBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.push("/healthworker/profile")}
          >
            <Image
              source={require("../../assets/images/profilepic.png")}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View className="flex-1 items-center mx-4">
            <Text className="text-gray-500 text-sm">{monitorText}</Text>
            <Text className="text-[#293231] text-lg font-bold">
              {nurseName}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notifications")}> 
            <Ionicons name="notifications-outline" size={24} color="#293231" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View className="mx-6 mt-6 mb-4">
          <LinearGradient
            colors={["#FBE9E2", "#A5DFD7"]}
            style={{
              borderRadius: 24,
              padding: 15,
            }}
          >
            <View className="border-[0.9px] border-[#FF7F50] rounded-2xl p-4">
              <Text className="text-center text-[#293231] text-sm mb-4">
                {caringForMothersText}
              </Text>
              <View className="flex-row justify-between">
                {/* Safe */}
                <View className="bg-[#00D2B3] rounded-2xl px-6 py-4 flex-1 mr-2">
                  <View className="flex-row items-center justify-between mb-1 gap-2">
                    <Text className=" font-semibold text-sm">{safeText}</Text>
                    <MaterialIcons name="health-and-safety" size={16} />
                  </View>
                  <Text className=" text-2xl font-bold">{stats.safe}</Text>
                </View>

                {/* Monitor */}
                <View className="bg-[#FFC107] rounded-2xl px-6 py-4 flex-1 mx-1">
                  <View className="flex-row items-center justify-between mb-1 gap-2">
                    <Text className=" font-semibold text-sm">
                      {monitorText}
                    </Text>
                    <Ionicons name="eye-outline" size={16} />
                  </View>
                  <Text className=" text-2xl font-bold">{stats.monitor}</Text>
                </View>

                {/* Urgent */}
                <View className="bg-[#F05246] rounded-2xl px-6 py-4 flex-1 ml-2">
                  <View className="flex-row items-center justify-between mb-1 gap-2">
                    <Text className=" font-semibold text-sm">{urgentText}</Text>
                    <AntDesign name="alert" size={16} />
                  </View>
                  <Text className=" text-2xl font-bold">{stats.urgent}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View className="mb-6 items-center">
          <View className="flex-row items-center justify-between w-[80%] gap-2">
            <TouchableOpacity
              className="bg-[#00D2B3] rounded-2xl py-3 px-6 flex-row items-center justify-center flex-1 gap-1"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={() => router.push("/healthworker/addPatient")}
            >
              <Text className="text-[#293231] font-semibold text-base ml-2">
                {addPatientText}
              </Text>
              <Ionicons name="person-add" size={20} color="#293231" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#00D2B3] rounded-2xl py-3 px-6 flex-row items-center justify-center flex-1 gap-1"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={() => router.push("/healthworker/logVisit")}
            >
              <Text className="text-[#293231] font-semibold text-base ml-2">
                {logVisitText}
              </Text>
              <Ionicons name="clipboard" size={20} color="#293231" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mothers Under Your Care */}
        <View className="px-6 mb-6">
          <Text className="text-[#293231] text-lg font-bold mb-4">
            {mothersUnderCareText}
          </Text>
          {mothersUnderCare.map((mother) => (
            <View
              key={mother.id}
              className="bg-white rounded-2xl p-4 mb-3 border-2"
              style={{ borderColor: getStatusColor(mother.status) }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={require("../../assets/images/profilepic.png")}
                    className="w-10 h-10 rounded-full mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-[#293231] font-semibold text-base mr-2">
                        {mother.name}
                      </Text>
                      {mother.status === "safe" ? (
                        <MaterialIcons
                          name="health-and-safety"
                          size={18}
                          color={getStatusColor(mother.status)}
                        />
                      ) : mother.status === "urgent" ? (
                        <AntDesign
                          name="alert"
                          size={18}
                          color={getStatusColor(mother.status)}
                        />
                      ) : (
                        <Ionicons
                          name={getStatusIcon(mother.status)}
                          size={18}
                          color={getStatusColor(mother.status)}
                        />
                      )}
                    </View>
                    <Text className="text-gray-500 text-sm">
                      {mother.weeks}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="border border-[#06D6A0] rounded-xl px-4 py-2"
                  onPress={() => router.push("/healthworker/motherInfo")}
                >
                  <Text className="text-[#06D6A0] font-semibold">
                    {viewText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-400 text-xs">{nextVisitText}</Text>
                  <Text className="text-[#293231] text-sm">
                    {mother.nextVisit}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs">{lastVisitText}</Text>
                  <Text className="text-[#293231] text-sm">
                    {mother.lastVisit}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity className="border border-gray-300 rounded-xl py-3 mt-2">
            <Text className="text-center text-[#293231] font-semibold">
              {viewAllText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Risky Distribution */}
        <View className="px-6 mb-6">
          <Text className="text-[#293231] text-lg font-bold mb-2">
            {riskyDistributionText}
          </Text>
          <Text className="text-gray-500 text-sm mb-4">
            {currentStatusText}
          </Text>
          <View className="bg-white rounded-2xl p-6 items-center">
            {/* Donut Chart Placeholder */}
            <View className="w-48 h-48 rounded-full bg-[#06D6A0] items-center justify-center mb-6">
              <View className="w-32 h-32 rounded-full bg-white" />
            </View>
            {/* Legend */}
            <View className="w-full">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded bg-[#06D6A0] mr-3" />
                  <Text className="text-[#293231] text-sm">{safeText}: 20</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded bg-[#FFD166] mr-3" />
                  <Text className="text-[#293231] text-sm">
                    {monitorText}: 8
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded bg-[#EF476F] mr-3" />
                  <Text className="text-[#293231] text-sm">
                    {urgentText}: 2
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded bg-[#293231] mr-3" />
                  <Text className="text-[#293231] text-sm font-bold">
                    {totalText}: 30
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Mothers Needing Attention */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-[#293231] text-lg font-bold mr-2">
              {mothersNeedingAttentionText}
            </Text>
            <Ionicons name="warning" size={20} color="#EF476F" />
          </View>
          {mothersNeedingAttention.map((mother) => (
            <View key={mother.id} className="bg-[#EF476F] rounded-2xl p-4 mb-3">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={require("../../assets/images/profilepic.png")}
                    className="w-10 h-10 rounded-full mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base">
                      {mother.name}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {mother.issue}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {mother.weeks}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-white rounded-xl px-4 py-2"
                  onPress={() => router.push("/healthworker/motherInfo")}
                >
                  <Text className="text-[#EF476F] font-semibold">
                    {viewText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/70 text-xs">{nextVisitText}</Text>
                  <Text className="text-white text-sm">{mother.nextVisit}</Text>
                </View>
                <View>
                  <Text className="text-white/70 text-xs">{lastVisitText}</Text>
                  <Text className="text-white text-sm">{mother.lastVisit}</Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity className="border border-gray-300 rounded-xl py-3 mt-2 bg-white">
            <Text className="text-center text-[#293231] font-semibold">
              {viewAllText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Visit Progress */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#293231] text-lg font-bold">
              {weeklyVisitProgressText}
            </Text>
            <Text className="text-gray-500 text-sm">Oct 1st-8th</Text>
          </View>
          <View className="flex-row justify-between">
            {/* Visits Completed */}
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2 border border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-3xl font-bold text-[#293231]">
                  {weeklyProgress.visitsCompleted}
                </Text>
                <Ionicons name="checkmark-circle" size={24} color="#06D6A0" />
              </View>
              <Text className="text-[#293231] font-semibold mb-3">
                {visitsCompletedText}
              </Text>
              <View className="bg-gray-200 rounded-full h-2 mb-2">
                <View
                  className="bg-[#06D6A0] rounded-full h-2"
                  style={{
                    width: `${
                      (weeklyProgress.visitsCompleted /
                        weeklyProgress.visitsTarget) *
                      100
                    }%`,
                  }}
                />
              </View>
              <Text className="text-gray-500 text-xs">
                {Math.round(
                  (weeklyProgress.visitsCompleted /
                    weeklyProgress.visitsTarget) *
                    100
                )}
                {ofWeeklyTargetText}
              </Text>
            </View>

            {/* New Registration */}
            <View className="bg-white rounded-2xl p-4 flex-1 ml-2 border border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-3xl font-bold text-[#293231]">
                  {weeklyProgress.newRegistration}
                </Text>
                <Ionicons name="person-add" size={24} color="#06D6A0" />
              </View>
              <Text className="text-[#293231] font-semibold mb-3">
                {newRegistrationText}
              </Text>
              <View className="bg-gray-200 rounded-full h-2 mb-2">
                <View
                  className="bg-[#06D6A0] rounded-full h-2"
                  style={{
                    width: `${
                      (weeklyProgress.newRegistration /
                        weeklyProgress.registrationTarget) *
                      100
                    }%`,
                  }}
                />
              </View>
              <Text className="text-gray-500 text-xs">
                {Math.round(
                  (weeklyProgress.newRegistration /
                    weeklyProgress.registrationTarget) *
                    100
                )}
                {ofWeeklyTargetText}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
