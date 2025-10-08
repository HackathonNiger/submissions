import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "../../utils/translator";

const isIOS = Platform.OS === "ios";

export default function MotherInfo() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("24/06/2025");

  // Translate all text
  const motherInfoText = useTranslation("Mother Information");
  const safeText = useTranslation("Safe");
  const patientInfoText = useTranslation("Patient Information");
  const bloodPressureText = useTranslation("Blood Pressure");
  const weightText = useTranslation("Weight");
  const temperatureText = useTranslation("Temperature");
  const bloodLevelText = useTranslation("Blood Level");
  const medicalHistoryText = useTranslation("Medical History");
  const visitDateText = useTranslation("Visit date");
  const medicationListText = useTranslation("Medication List");
  const updateText = useTranslation("Update");

  // Mock mother data
  const motherData = {
    name: "Amara Okafor",
    weeks: "24 weeks pregnant",
    status: "Safe",
    profileImage: require("../../assets/images/profilepic.png"),
    bloodPressure: "120/80mmHg",
    weight: "65KKg",
    temperature: "36.8°C",
    bloodLevel: "12.5g/dl)",
    medicalHistory:
      "Amara a second-time mother at 32 weeks gestation, is experiencing a healthy pregnancy with mild anemia managed by supplements, normal vitals, and no complications reported from her previous or current pregnancy.",
    visitDate: "24/06/2025",
    medications: [
      "Folic Acid – 5 mg daily",
      "Ferrous Sulfate – 200 mg daily",
      "Calcium Gluconate – 1 tablet daily",
      "Vitamin C – 100 mg daily",
      "Prenatal Multivitamins – 1 tablet daily",
      "Paracetamol – 500 mg as needed",
    ],
  };

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header */}
      <View
        className="bg-white border-b border-gray-200"
        style={{
          paddingTop: isIOS ? 50 : StatusBar.currentHeight || 24,
          paddingBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#293231" />
          </TouchableOpacity>
          <Text className="text-[#293231] text-xl font-bold">
            {motherInfoText}
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Mother Profile Card */}
        <View className="px-6 mt-6">
          <LinearGradient
            colors={["#B5FFFC", "#FFDEE9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={motherData.profileImage}
                  className="w-12 h-12 rounded-full mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-[#293231] font-bold text-lg mr-2">
                      {motherData.name}
                    </Text>
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color="#00D2B3"
                    />
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {motherData.weeks}
                  </Text>
                </View>
              </View>
              <View className="bg-[#00D2B3] rounded-full px-4 py-2">
                <Text className="text-white font-semibold text-sm">
                  {safeText}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Patient Information */}
        <View className="px-6 mt-6">
          <Text className="text-[#293231] text-lg font-bold mb-4">
            {patientInfoText}
          </Text>
          <LinearGradient
            colors={["#E8F8F5", "#FFF5F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View className="flex-row flex-wrap">
              {/* Blood Pressure */}
              <View className="w-[48%] bg-white rounded-xl p-4 mb-3 mr-[4%]">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="water" size={20} color="#EF476F" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {bloodPressureText}
                  </Text>
                </View>
                <Text className="text-[#293231] font-bold text-base">
                  {motherData.bloodPressure}
                </Text>
              </View>

              {/* Weight */}
              <View className="w-[48%] bg-white rounded-xl p-4 mb-3">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={20}
                    color="#293231"
                  />
                  <Text className="text-gray-600 text-sm ml-2">
                    {weightText}
                  </Text>
                </View>
                <Text className="text-[#293231] font-bold text-base">
                  {motherData.weight}
                </Text>
              </View>

              {/* Temperature */}
              <View className="w-[48%] bg-white rounded-xl p-4 mr-[4%]">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons
                    name="thermometer"
                    size={20}
                    color="#293231"
                  />
                  <Text className="text-gray-600 text-sm ml-2">
                    {temperatureText}
                  </Text>
                </View>
                <Text className="text-[#293231] font-bold text-base">
                  {motherData.temperature}
                </Text>
              </View>

              {/* Blood Level */}
              <View className="w-[48%] bg-white rounded-xl p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="water" size={20} color="#EF476F" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {bloodLevelText}
                  </Text>
                </View>
                <Text className="text-[#293231] font-bold text-base">
                  {motherData.bloodLevel}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Medical History */}
        <View className="px-6 mt-6">
          <Text className="text-[#293231] text-lg font-bold mb-4">
            {medicalHistoryText}
          </Text>
          <View className="bg-white rounded-2xl p-5 border border-gray-200">
            <Text className="text-gray-700 text-sm leading-6">
              {motherData.medicalHistory}
            </Text>
          </View>
        </View>

        {/* Visit Date */}
        <View className="px-6 mt-6">
          <Text className="text-[#293231] text-lg font-bold mb-4">
            {visitDateText}
          </Text>
          <TouchableOpacity className="bg-white rounded-2xl p-4 border-2 border-[#00D2B3] flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#00D2B3" />
              <Text className="text-[#293231] font-semibold text-base ml-3">
                {selectedDate}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#293231" />
          </TouchableOpacity>
        </View>

        {/* Medication List */}
        <View className="px-6 mt-6 mb-8">
          <Text className="text-[#293231] text-lg font-bold mb-4">
            {medicationListText}
          </Text>
          <View className="bg-white rounded-2xl p-5 border border-gray-200">
            {motherData.medications.map((medication, index) => (
              <View key={index} className="mb-3">
                <Text className="text-gray-700 text-sm leading-6">
                  {index + 1}. {medication}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Update Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity className="bg-[#00695C] rounded-2xl py-4 items-center shadow-lg">
            <Text className="text-white font-bold text-base">{updateText}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
