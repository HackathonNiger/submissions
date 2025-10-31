import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useAuthWorkerStore from "../../store/useAuthWorkerStore";
import { useTranslation } from "../../utils/translator";

export default function HealthInfoStep() {
  const router = useRouter();
  const { worker, updateProfileInformation, isLoading } = useAuthWorkerStore();

  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityCode, setFacilityCode] = useState("");
  const [error, setError] = useState("");

  // Pre-fill form with existing worker data
  useEffect(() => {
    if (worker) {
      if (worker.fullName) setFullName(worker.fullName);
      if (worker.state) setState(worker.state);
      if (worker.localGovernment) setLga(worker.localGovernment);
      if (worker.facilityName) setFacilityName(worker.facilityName);
      if (worker.facilityCode) setFacilityCode(worker.facilityCode);
    }
  }, [worker]);

  // Translate all text
  const personalInfoText = useTranslation("Personal information");
  const fullNameText = useTranslation("Full Name");
  const fullNamePlaceholder = useTranslation("Enter full name");
  const stateText = useTranslation("State");
  const statePlaceholder = useTranslation("Enter state");
  const lgaText = useTranslation("LGA");
  const lgaPlaceholder = useTranslation("Enter LGA");
  const facilityNameText = useTranslation("Facility Name");
  const facilityNamePlaceholder = useTranslation("Enter facility name");
  const facilityCodeText = useTranslation("Facility Code / ID");
  const facilityCodePlaceholder = useTranslation("Enter facility code or ID");
  const proceedText = useTranslation("Proceed");
  const profileCompleteText = useTranslation("Profile Complete!");
  const infoSavedText = useTranslation(
    "Your information has been saved successfully"
  );
  const updateFailedText = useTranslation("Update Failed");
  const failedToSaveText = useTranslation("Failed to save your information");

  const handleProceed = async () => {
    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your full name",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!state.trim()) {
      setError("State is required");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your state",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!lga.trim()) {
      setError("LGA is required");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your LGA",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!facilityName.trim()) {
      setError("Facility name is required");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter facility name",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!facilityCode.trim()) {
      setError("Facility code/ID is required");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter facility code or ID",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    setError("");

    // Prepare data matching backend field names
    const healthcareData = {
      fullName: fullName.trim(),
      state: state.trim(),
      localGovernment: lga.trim(), // Backend expects localGovernment
      facilityName: facilityName.trim(),
      facilityCode: facilityCode.trim(),
    };

    console.log("Healthcare worker data:", healthcareData);

    // Call updateProfileInformation from store
    const result = await updateProfileInformation(healthcareData);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: profileCompleteText,
        text2: infoSavedText,
        position: "top",
        visibilityTime: 2000,
      });

      // Navigate to healthcare dashboard after success
      setTimeout(() => {
        router.replace("/healthworker/dashboard");
      }, 2000);
    } else {
      setError(result.error || failedToSaveText);
      Toast.show({
        type: "error",
        text1: updateFailedText,
        text2: result.error || failedToSaveText,
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        <ScrollView className="flex-1 px-6 pt-6">
          <Text className="text-2xl font-bold text-[#293231] mb-6">
            {personalInfoText}
          </Text>

          {/* Full Name */}
          <Text className="text-[#293231] mb-2 text-[15px]">
            {fullNameText}
          </Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-2xl px-4 py-4 mb-5"
            placeholder={fullNamePlaceholder}
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
            editable={!isLoading}
          />

          {/* State and LGA Row */}
          <View className="flex-row mb-5">
            <View className="flex-1 mr-3">
              <Text className="text-[#293231] mb-2 text-[15px]">
                {stateText}
              </Text>
              <TextInput
                className="border border-gray-300 bg-white rounded-2xl px-4 py-4"
                placeholder={statePlaceholder}
                placeholderTextColor="#9CA3AF"
                value={state}
                onChangeText={setState}
                editable={!isLoading}
              />
            </View>

            <View className="flex-1">
              <Text className="text-[#293231] mb-2 text-[15px]">{lgaText}</Text>
              <TextInput
                className="border border-gray-300 bg-white rounded-2xl px-4 py-4"
                placeholder={lgaPlaceholder}
                placeholderTextColor="#9CA3AF"
                value={lga}
                onChangeText={setLga}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Facility Name */}
          <Text className="text-[#293231] mb-2 text-[15px]">
            {facilityNameText}
          </Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-2xl px-4 py-4 mb-5"
            placeholder={facilityNamePlaceholder}
            placeholderTextColor="#9CA3AF"
            value={facilityName}
            onChangeText={setFacilityName}
            editable={!isLoading}
          />

          {/* Facility Code / ID */}
          <Text className="text-[#293231] mb-2 text-[15px]">
            {facilityCodeText}
          </Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-2xl px-4 py-4 mb-8"
            placeholder={facilityCodePlaceholder}
            placeholderTextColor="#9CA3AF"
            value={facilityCode}
            onChangeText={setFacilityCode}
            editable={!isLoading}
          />

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 mb-4 text-sm">{error}</Text>
          ) : null}

          {/* Spacer */}
          <View className="h-20" />
        </ScrollView>

        {/* Proceed Button - Fixed at bottom */}
        <View className="px-6 pb-8 pt-4">
          <TouchableOpacity
            className="bg-[#006D5B] py-5 rounded-3xl"
            style={{
              shadowColor: "#006D5B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            onPress={handleProceed}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-bold text-[17px]">
                {proceedText}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Toast component */}
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
}
