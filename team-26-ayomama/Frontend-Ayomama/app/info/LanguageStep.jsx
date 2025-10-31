import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import useAuthStore from "../../store/useAuthStore";
import useTranslatorStore from "../../store/useTranslatorStore";
import { useTranslation } from "../../utils/translator";

export default function LanguageStep({ onNext }) {
  const { updateLanguagePreference, isLoading } = useAuthStore();
  const { setLanguage } = useTranslatorStore();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [error, setError] = useState("");

  // Translate all text
  const languageQuestionText = useTranslation("Which language do you prefer?");
  const englishText = useTranslation("English");
  const hausaText = useTranslation("Hausa");
  const yorubaText = useTranslation("Yoruba");
  const igboText = useTranslation("Igbo");
  const proceedText = useTranslation("Proceed");
  const selectLanguageErrorText = useTranslation(
    "Please select a language before proceeding"
  );
  const languageUpdatedText = useTranslation("Language Updated");
  const languageSetText = useTranslation("Your preferred language is set to");
  const updateFailedText = useTranslation("Update Failed");
  const failedToUpdateText = useTranslation(
    "Failed to update language preference"
  );

  // Map display language to backend enum values
  const languageMap = {
    English: "en",
    Yoruba: "yo",
    Hausa: "ha",
    Igbo: "ig",
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    setError("");

    // Update language immediately for live preview
    const languageCode = languageMap[language];
    if (languageCode) {
      await setLanguage(languageCode);
    }
  };

  const handleProceed = async () => {
    if (!selectedLanguage) {
      setError(selectLanguageErrorText);
      return;
    }

    // Get the backend language code
    const languageCode = languageMap[selectedLanguage];

    // Update language preference in translator store
    await setLanguage(languageCode);

    // Update language preference via API
    const result = await updateLanguagePreference(languageCode);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: languageUpdatedText,
        text2: `${languageSetText} ${selectedLanguage}`,
        position: "top",
        visibilityTime: 2000,
      });
      onNext();
    } else {
      setError(result.error || failedToUpdateText);
      Toast.show({
        type: "error",
        text1: updateFailedText,
        text2: result.error || failedToUpdateText,
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View className="flex-1 px-6 py-8 justify-between">
      <View>
        {/* Title */}
        <Text className="text-2xl font-bold text-left mb-10">
          {languageQuestionText}
        </Text>
        {/* English */}
        <TouchableOpacity
          className={`px-4 py-[14px] rounded-2xl mb-4 border flex-row justify-center items-center ${
            selectedLanguage === "English"
              ? "bg-black border-black"
              : "bg-[#FCFCFC] border-gray-300"
          }`}
          onPress={() => handleLanguageSelect("English")}
        >
          <Text
            className={`text-base text-center ${
              selectedLanguage === "English" ? "text-white" : "text-black"
            }`}
          >
            {englishText}
          </Text>
        </TouchableOpacity>
        {/* Hausa */}
        <TouchableOpacity
          className={`px-4 py-[14px] rounded-2xl mb-4 border flex-row justify-center items-center ${
            selectedLanguage === "Hausa"
              ? "bg-black border-black"
              : "bg-[#FCFCFC] border-gray-300"
          }`}
          onPress={() => handleLanguageSelect("Hausa")}
        >
          <Text
            className={`text-base text-center ${
              selectedLanguage === "Hausa" ? "text-white" : "text-black"
            }`}
          >
            {hausaText}
          </Text>
        </TouchableOpacity>
        {/* Yoruba */}
        <TouchableOpacity
          className={`px-4 py-[14px] rounded-2xl mb-4 border flex-row justify-center items-center ${
            selectedLanguage === "Yoruba"
              ? "bg-black border-black"
              : "bg-[#FCFCFC] border-gray-300"
          }`}
          onPress={() => handleLanguageSelect("Yoruba")}
        >
          <Text
            className={`text-base text-center ${
              selectedLanguage === "Yoruba" ? "text-white" : "text-black"
            }`}
          >
            {yorubaText}
          </Text>
        </TouchableOpacity>
        {/* Igbo */}
        <TouchableOpacity
          className={`px-4 py-[14px] rounded-2xl border flex-row justify-center items-center ${
            selectedLanguage === "Igbo"
              ? "bg-black border-black"
              : "bg-[#FCFCFC] border-gray-300"
          }`}
          onPress={() => handleLanguageSelect("Igbo")}
        >
          <Text
            className={`text-base text-center ${
              selectedLanguage === "Igbo" ? "text-white" : "text-black"
            }`}
          >
            {igboText}
          </Text>
        </TouchableOpacity>
        {/* Error message */}
        {error ? (
          <Text className="text-red-500 text-sm mt-4 text-center">{error}</Text>
        ) : null}
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        className="bg-[#006D5B] py-5 rounded-2xl"
        onPress={handleProceed}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-center font-bold text-base">
            {proceedText}
          </Text>
        )}
      </TouchableOpacity>

      {/* Toast component */}
      <Toast />
    </View>
  );
}
