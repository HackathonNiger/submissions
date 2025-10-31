import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
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
import Icon from "react-native-vector-icons/MaterialIcons";
import PickerModal from "../../components/PickerModal";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

export default function AntenatalStep({ onNext, onBack }) {
  const [hasStarted, setHasStarted] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState(null); // 'prescribed' | 'avoid' | null
  const [error, setError] = useState("");

  const { submitAntenatalData } = useAuthStore();

  // Translate all text
  const antenatalText = useTranslation("Antenatal");
  const haveYouStartedText = useTranslation("Have you started antenatal?");
  const yesText = useTranslation("Yes");
  const noText = useTranslation("No");
  const proceedText = useTranslation("Proceed");
  const bloodPressureText = useTranslation("Blood Pressure");
  const temperatureText = useTranslation("Temperature (°C)");
  const weightText = useTranslation("Weight (kg)");
  const bloodLevelText = useTranslation("Blood Level (g/dL)");
  const prescribedDrugsText = useTranslation("Prescribed Drugs");
  const drugsToAvoidText = useTranslation("Drugs to Avoid");
  const dateText = useTranslation("Date");
  const selectText = useTranslation("Select");
  const selectDrugsText = useTranslation("Select Drugs");
  const backText = useTranslation("Back");
  const validationErrorText = useTranslation("Validation Error");
  const selectYesNoText = useTranslation("Please select Yes or No to continue");
  const enterBloodPressureText = useTranslation("Please enter blood pressure");
  const enterValidTemperatureText = useTranslation("Please enter a valid temperature (number)");
  const enterValidWeightText = useTranslation("Please enter a valid weight (number)");
  const enterValidBloodLevelText = useTranslation("Please enter a valid blood level (number)");
  const selectPrescribedDrugsText = useTranslation("Please select prescribed drugs");
  const selectDrugsAvoidText = useTranslation("Please select drugs to avoid");
  const selectDateText = useTranslation("Please select a date");
  const antenatalSavedText = useTranslation("Antenatal Info Saved");
  const detailsRecordedText = useTranslation("Your antenatal details have been recorded successfully");
  const submissionFailedText = useTranslation("Submission Failed");
  const somethingWentWrongText = useTranslation("Something went wrong, please try again");

  const [formData, setFormData] = useState({
    bloodPressure: "",
    temperature: "",
    weight: "",
    bloodLevel: "",
    prescribedDrugs: "",
    drugsToAvoid: "",
    date: new Date().toISOString(),
  });

  // Comprehensive drug lists for pregnant mothers
  const prescribedDrugsList = [
    "Folic Acid",
    "Iron Tablets",
    "Calcium Supplements",
    "Prenatal Vitamins",
    "Vitamin D",
    "Omega-3 Supplements",
    "Magnesium",
    "Zinc Supplements",
    "Vitamin B12",
    "Docusate (Stool Softener)",
    "Acetaminophen/Paracetamol",
    "Methyldopa (Blood Pressure)",
    "Nifedipine (Blood Pressure)",
    "Labetalol (Blood Pressure)",
    "Insulin (Diabetes)",
    "Metformin (Diabetes)",
    "Levothyroxine (Thyroid)",
    "Antihistamines (Allergies)",
    "Antibiotics (Penicillin, Amoxicillin)",
    "Anti-nausea medications",
  ];

  const drugsToAvoidList = [
    "Aspirin (High Dose)",
    "Ibuprofen (NSAIDs)",
    "Naproxen",
    "Diclofenac",
    "Warfarin",
    "ACE Inhibitors",
    "ARB Medications",
    "Isotretinoin (Accutane)",
    "Tetracycline Antibiotics",
    "Fluoroquinolones",
    "Sulfonamides",
    "Methotrexate",
    "Lithium",
    "Phenytoin",
    "Valproic Acid",
    "Carbamazepine",
    "Alcohol",
    "Tobacco/Nicotine",
    "Cocaine",
    "Marijuana",
    "Herbal Supplements (Unverified)",
    "High-dose Vitamin A",
    "Raw Fish/Sushi",
    "Unpasteurized Dairy",
    "Excessive Caffeine",
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const formatDate = (date) => {
    if (!date) return selectText + " " + dateText;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData((prev) => ({ ...prev, date: selectedDate.toISOString() }));
    }
  };

  const handleDrugSelect = (type, drug) => {
    if (type === "prescribed") {
      const currentDrugs = formData.prescribedDrugs ? formData.prescribedDrugs.split(", ") : [];
      if (!currentDrugs.includes(drug)) {
        const newDrugs = [...currentDrugs, drug].join(", ");
        handleChange("prescribedDrugs", newDrugs);
      }
    } else if (type === "avoid") {
      const currentDrugs = formData.drugsToAvoid ? formData.drugsToAvoid.split(", ") : [];
      if (!currentDrugs.includes(drug)) {
        const newDrugs = [...currentDrugs, drug].join(", ");
        handleChange("drugsToAvoid", newDrugs);
      }
    }
    setOpenPicker(null);
  };

  const handleProceed = async () => {
    if (loading) return;

    // Step 1: Validation for Yes/No stage
    if (!showForm) {
      if (hasStarted === null) {
        Toast.show({
          type: "error",
          text1: validationErrorText,
          text2: selectYesNoText,
          visibilityTime: 2000,
        });
        return;
      }

      // If user selected "No", skip form and go next
      if (hasStarted === false) {
        onNext();
      } else {
        // Show form if "Yes" selected
        setShowForm(true);
      }
      return;
    }

    // Step 2: Validation for form fields
    if (!formData.bloodPressure.trim()) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterBloodPressureText,
        visibilityTime: 2000,
      });
      return;
    }
    if (
      !formData.temperature.trim() ||
      isNaN(parseFloat(formData.temperature))
    ) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterValidTemperatureText,
        visibilityTime: 2000,
      });
      return;
    }
    if (!formData.weight.trim() || isNaN(parseFloat(formData.weight))) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterValidWeightText,
        visibilityTime: 2000,
      });
      return;
    }
    if (!formData.bloodLevel.trim() || isNaN(parseFloat(formData.bloodLevel))) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterValidBloodLevelText,
        visibilityTime: 2000,
      });
      return;
    }
    if (!formData.prescribedDrugs.trim()) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: selectPrescribedDrugsText,
        visibilityTime: 2000,
      });
      return;
    }
    if (!formData.drugsToAvoid.trim()) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: selectDrugsAvoidText,
        visibilityTime: 2000,
      });
      return;
    }
    if (!formData.date) {
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: selectDateText,
        visibilityTime: 2000,
      });
      return;
    }

    // Step 3: Submit data to backend with proper types
    try {
      setLoading(true);
      const dataToSubmit = {
        bloodPressure: formData.bloodPressure.trim(),
        temperature: parseFloat(formData.temperature),
        weight: parseFloat(formData.weight),
        bloodLevel: parseFloat(formData.bloodLevel),
        prescribedDrugs: formData.prescribedDrugs.trim(),
        drugsToAvoid: formData.drugsToAvoid.trim(),
        date: formData.date,
      };
      const result = await submitAntenatalData(dataToSubmit);
      setLoading(false);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: antenatalSavedText,
          text2: detailsRecordedText,
          visibilityTime: 2000,
        });
        onNext();
      } else {
        Toast.show({
          type: "error",
          text1: submissionFailedText,
          text2: result.error || somethingWentWrongText,
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error("Antenatal submission failed:", error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: submissionFailedText,
        text2: somethingWentWrongText,
        visibilityTime: 2000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="flex-1 p-5 pt-6"
        >
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            {antenatalText}
          </Text>

          {/* STEP 1: Yes/No Section */}
          {!showForm && (
            <View>
              <Text className="text-gray-700 mb-4 text-base">
                {haveYouStartedText}
              </Text>
              <View className="flex-row justify-between mb-8">
                {[yesText, noText].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setHasStarted(option === yesText)}
                    className={`border border-gray-300 bg-white rounded-2xl px-5 py-4 flex-row items-center justify-between flex-1 mx-1`}
                  >
                    <Text className="text-gray-800 text-base font-medium">
                      {option}
                    </Text>
                    <View
                      className={`w-5 h-5 rounded-full border-2 ${
                        hasStarted === (option === yesText)
                          ? "border-[#006D5B] bg-[#006D5B]"
                          : "border-gray-400 bg-white"
                      }`}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleProceed}
                className="bg-[#006D5B] rounded-2xl py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  {proceedText}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Antenatal Form */}
          {showForm && (
            <View className="mt-2">
              {/* Blood Pressure (String) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{bloodPressureText} *</Text>
                <View className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px]">
                  <Icon
                    name="favorite"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-[16px] text-gray-800"
                    value={formData.bloodPressure}
                    onChangeText={(val) => handleChange("bloodPressure", val)}
                    placeholder="120/80"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Temperature (Number) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{temperatureText} *</Text>
                <View className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px]">
                  <Icon
                    name="thermostat"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-[16px] text-gray-800"
                    value={formData.temperature}
                    onChangeText={(val) => handleChange("temperature", val)}
                    placeholder="37.0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Weight (Number) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{weightText} *</Text>
                <View className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px]">
                  <Icon
                    name="monitor-weight"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-[16px] text-gray-800"
                    value={formData.weight}
                    onChangeText={(val) => handleChange("weight", val)}
                    placeholder="65.5"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Blood Level (Number) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{bloodLevelText} *</Text>
                <View className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px]">
                  <Icon
                    name="opacity"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-[16px] text-gray-800"
                    value={formData.bloodLevel}
                    onChangeText={(val) => handleChange("bloodLevel", val)}
                    placeholder="12.5"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Prescribed Drugs (Dropdown) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{prescribedDrugsText} *</Text>
                <TouchableOpacity
                  onPress={() => setOpenPicker("prescribed")}
                  className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px] min-h-[48px]"
                >
                  <Icon
                    name="medication"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`flex-1 text-[16px] ${
                      formData.prescribedDrugs ? "text-gray-800" : "text-gray-400"
                    }`}
                    numberOfLines={2}
                  >
                    {formData.prescribedDrugs || "Folic acid, Iron tablets"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Drugs to Avoid (Dropdown) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{drugsToAvoidText} *</Text>
                <TouchableOpacity
                  onPress={() => setOpenPicker("avoid")}
                  className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px] min-h-[48px]"
                >
                  <Icon
                    name="dangerous"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`flex-1 text-[16px] ${
                      formData.drugsToAvoid ? "text-gray-800" : "text-gray-400"
                    }`}
                    numberOfLines={2}
                  >
                    {formData.drugsToAvoid || "Aspirin, Alcohol, etc."}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Date (Date picker) */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">{dateText} *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border border-gray-300 bg-[#FCFCFC] rounded-2xl flex-row items-center px-4 py-[14px]"
                >
                  <Icon
                    name="calendar-today"
                    size={22}
                    color="#999"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="flex-1 text-[16px] text-gray-800">
                    {formatDate(selectedDate)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#888" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display="default"
                    value={selectedDate}
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View className="flex-row justify-between mt-6 mb-8">
                <TouchableOpacity
                  className="bg-gray-400 rounded-2xl py-4 px-8"
                  onPress={() => setShowForm(false)}
                  disabled={loading}
                >
                  <Text className="text-white font-semibold">{backText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleProceed}
                  className="bg-[#006D5B] rounded-2xl py-4 px-8 flex-row items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-white font-semibold">{proceedText}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Drug Picker Modals */}
          <PickerModal
            visible={openPicker === "prescribed"}
            options={prescribedDrugsList}
            onSelect={(drug) => handleDrugSelect("prescribed", drug)}
            onClose={() => setOpenPicker(null)}
            title={`${selectText} ${prescribedDrugsText}`}
          />

          <PickerModal
            visible={openPicker === "avoid"}
            options={drugsToAvoidList}
            onSelect={(drug) => handleDrugSelect("avoid", drug)}
            onClose={() => setOpenPicker(null)}
            title={`${selectText} ${drugsToAvoidText}`}
          />

          <Toast />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
