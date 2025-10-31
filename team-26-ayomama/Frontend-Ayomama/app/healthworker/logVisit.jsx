import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "../../utils/translator";

const isIOS = Platform.OS === "ios";

export default function LogVisit() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [pregnancyStage, setPregnancyStage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [medicationList, setMedicationList] = useState("");
  const [riskStatus, setRiskStatus] = useState("Urgent");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [patientInformation, setPatientInformation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Translate all text
  const logVisitText = useTranslation("Log Visit");
  const patientNameText = useTranslation("Patient Name");
  const patientNamePlaceholder = useTranslation("Grace Adam");
  const pregnancyStageText = useTranslation("Pregnancy stage");
  const pregnancyStagePlaceholder = useTranslation("36 weeks");
  const visitDateText = useTranslation("Visit date");
  const medicationListText = useTranslation("Medication List");
  const riskStatusText = useTranslation("Risk Status");
  const medicalHistoryText = useTranslation("Medical History");
  const patientInformationText = useTranslation("Patient information");
  const saveText = useTranslation("Save");
  const savingText = useTranslation("Saving...");
  const requiredFieldText = useTranslation("Required Field");
  const enterPatientNameText = useTranslation("Please enter patient name");
  const enterPregnancyStageText = useTranslation(
    "Please enter pregnancy stage"
  );
  const selectVisitDateText = useTranslation("Please select visit date");
  const successText = useTranslation("Success");
  const visitLoggedText = useTranslation("Visit logged successfully");
  const errorText = useTranslation("Error");
  const failedToLogVisitText = useTranslation(
    "Failed to log visit. Please try again."
  );

  const handleSave = async () => {
    // Validation
    if (!patientName.trim()) {
      Toast.show({
        type: "error",
        text1: requiredFieldText,
        text2: enterPatientNameText,
      });
      return;
    }

    if (!pregnancyStage.trim()) {
      Toast.show({
        type: "error",
        text1: requiredFieldText,
        text2: enterPregnancyStageText,
      });
      return;
    }

    if (!visitDate.trim()) {
      Toast.show({
        type: "error",
        text1: requiredFieldText,
        text2: selectVisitDateText,
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to save visit log
      const visitData = {
        patientName,
        pregnancyStage,
        visitDate,
        medicationList,
        riskStatus,
        medicalHistory,
        patientInformation,
      };

      console.log("Visit Data:", visitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Toast.show({
        type: "success",
        text1: successText,
        text2: visitLoggedText,
      });

      // Navigate back to dashboard
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: errorText,
        text2: failedToLogVisitText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="bg-white"
        style={{
          paddingTop: isIOS ? 50 : StatusBar.currentHeight || 24,
          paddingBottom: 16,
          paddingHorizontal: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0"
          >
            <Ionicons name="arrow-back" size={24} color="#293231" />
          </TouchableOpacity>
          <Text className="text-[#293231] text-xl font-bold">
            {logVisitText}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Patient Name */}
        <View className="mt-6">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {patientNameText}
          </Text>
          <TextInput
            className="border border-[#00D2B3] rounded-3xl px-4 py-3 text-[#293231]"
            placeholder={patientNamePlaceholder}
            placeholderTextColor="#9CA3AF"
            value={patientName}
            onChangeText={setPatientName}
          />
        </View>

        {/* Pregnancy Stage */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {pregnancyStageText}
          </Text>
          <TextInput
            className="border border-[#00D2B3] rounded-3xl px-4 py-3 text-[#293231]"
            placeholder={pregnancyStagePlaceholder}
            placeholderTextColor="#9CA3AF"
            value={pregnancyStage}
            onChangeText={setPregnancyStage}
          />
        </View>

        {/* Visit Date */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {visitDateText}
          </Text>
          <View className="border border-[#00D2B3] rounded-3xl px-4 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#293231"
                style={{ marginRight: 8 }}
              />
              <TextInput
                className="flex-1 text-[#293231]"
                placeholder="dd/mm/yyyy"
                placeholderTextColor="#9CA3AF"
                value={visitDate}
                onChangeText={setVisitDate}
              />
            </View>
            <AntDesign name="down" size={16} color="#293231" />
          </View>
        </View>

        {/* Medication List */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {medicationListText}
          </Text>
          <View className="border border-[#00D2B3] rounded-3xl px-4 py-3 flex-row items-center">
            <Ionicons
              name="medical-outline"
              size={20}
              color="#293231"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-[#293231]"
              placeholder=""
              placeholderTextColor="#9CA3AF"
              value={medicationList}
              onChangeText={setMedicationList}
            />
          </View>
        </View>

        {/* Risk Status */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {riskStatusText}
          </Text>
          <View className="border border-[#00D2B3] rounded-3xl px-4 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <AntDesign
                name="warning"
                size={20}
                color="#293231"
                style={{ marginRight: 8 }}
              />
              <Text className="text-[#293231] flex-1">{riskStatus}</Text>
              <View className="w-5 h-5 rounded-full bg-red-500 items-center justify-center ml-2">
                <Ionicons name="close" size={14} color="white" />
              </View>
            </View>
            <AntDesign name="down" size={16} color="#293231" />
          </View>
        </View>

        {/* Medical History */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {medicalHistoryText}
          </Text>
          <TextInput
            className="border border-[#00D2B3] rounded-3xl px-4 py-3 text-[#293231]"
            placeholder=""
            placeholderTextColor="#9CA3AF"
            value={medicalHistory}
            onChangeText={setMedicalHistory}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
        </View>

        {/* Patient Information */}
        <View className="mt-4">
          <Text className="text-[#293231] text-base font-medium mb-2">
            {patientInformationText}
          </Text>
          <TextInput
            className="border border-[#00D2B3] rounded-3xl px-4 py-3 text-[#293231]"
            placeholder=""
            placeholderTextColor="#9CA3AF"
            value={patientInformation}
            onChangeText={setPatientInformation}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
        </View>
      </ScrollView>

      {/* Save Button - Fixed at Bottom */}
      <View className="px-6 py-4">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className="bg-[#00695C] rounded-3xl py-4"
          style={{
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Text className="text-white text-center text-base font-semibold">
            {isLoading ? savingText : saveText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
