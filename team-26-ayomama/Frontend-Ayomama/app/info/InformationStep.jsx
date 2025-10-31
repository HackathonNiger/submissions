import { Ionicons } from "@expo/vector-icons";
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
import PickerModal from "../../components/PickerModal";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

export default function InformationStep({ onNext, onBack }) {
  const {
    updateProfileInformation,
    isLoading: authLoading,
    user,
  } = useAuthStore();

  const [fullName, setFullName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [lastPeriodMonth, setLastPeriodMonth] = useState("");
  const [lastPeriodDay, setLastPeriodDay] = useState("");
  const [lastPeriodYear, setLastPeriodYear] = useState("");
  const [openPicker, setOpenPicker] = useState(null); // 'month' | 'day' | 'year' | null
  const [openRelationPicker, setOpenRelationPicker] = useState(null); // contact id for relation selection
  const [error, setError] = useState("");

  // Translate all text
  const personalInfoText = useTranslation("Personal Information");
  const fullNameText = useTranslation("Full Name");
  const enterFullNameText = useTranslation("Enter full name");
  const homeAddressText = useTranslation("Home Address");
  const enterAddressText = useTranslation("Enter address");
  const yourPhoneNumberText = useTranslation("Your Phone Number");
  const lastPeriodText = useTranslation("When last did you see your period?");
  const monthText = useTranslation("Month");
  const dayText = useTranslation("Day");
  const yearText = useTranslation("Year");
  const selectText = useTranslation("Select");
  const selectRelationText = useTranslation("Select Relation");
  const emergencyContactsText = useTranslation("Emergency Contact(s)");
  const addContactText = useTranslation("Add Contact");
  const contactText = useTranslation("Contact");
  const removeText = useTranslation("Remove");
  const nameText = useTranslation("Name");
  const enterNameText = useTranslation("Enter name");
  const phoneNumberText = useTranslation("Phone Number");
  const relationText = useTranslation("Relation");
  const selectRelationPlaceholderText = useTranslation("Select relation");
  const backText = useTranslation("Back");
  const nextText = useTranslation("Next");
  const validationErrorText = useTranslation("Validation Error");
  const enterFullNameErrorText = useTranslation("Please enter your full name");
  const fullNameRequiredText = useTranslation("Full name is required");
  const enterAddressErrorText = useTranslation("Please enter your address");
  const addressRequiredText = useTranslation("Address is required");
  const enterPhoneNumberErrorText = useTranslation(
    "Please enter your phone number"
  );
  const phoneNumberRequiredText = useTranslation("Phone number is required");
  const selectLastPeriodErrorText = useTranslation(
    "Please select your last period date"
  );
  const lastPeriodRequiredText = useTranslation("Last period date is required");
  const addEmergencyContactErrorText = useTranslation(
    "Please add at least one complete emergency contact"
  );
  const emergencyContactRequiredText = useTranslation(
    "At least one emergency contact is required"
  );
  const profileUpdatedText = useTranslation("Profile Updated");
  const infoSavedText = useTranslation(
    "Your information has been saved successfully"
  );
  const updateFailedText = useTranslation("Update Failed");
  const failedToSaveText = useTranslation("Failed to save your information");
  const failedToUpdateProfileText = useTranslation("Failed to update profile");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const years = Array.from(
    { length: 6 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  const handleSelect = (type, value) => {
    if (type === "month") setLastPeriodMonth(value);
    if (type === "day") setLastPeriodDay(value);
    if (type === "year") setLastPeriodYear(value);
    setOpenPicker(null);
  };

  // Emergency contacts list
  const [contacts, setContacts] = useState([
    { id: Date.now().toString(), number: "", name: "", relation: "" },
  ]);

  const relationOptions = [
    "Father",
    "Mother",
    "Sister",
    "Brother",
    "Spouse",
    "Friend",
    "Doctor",
    "Guardian",
    "Neighbor",
    "Other",
  ];

  const updateContact = (id, field, value) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addContact = () => {
    setContacts((prev) => [
      ...prev,
      {
        id: (Date.now() + Math.random()).toString(),
        number: "",
        name: "",
        relation: "",
      },
    ]);
  };

  const removeContact = (id) => {
    setContacts((prev) =>
      prev.length === 1 ? prev : prev.filter((c) => c.id !== id)
    );
  };

  const handleNext = async () => {
    // Validation
    if (!fullName.trim()) {
      setError(fullNameRequiredText);
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterFullNameErrorText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!address.trim()) {
      setError(addressRequiredText);
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterAddressErrorText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!phoneNumber.trim()) {
      setError(phoneNumberRequiredText);
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: enterPhoneNumberErrorText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!lastPeriodMonth || !lastPeriodDay || !lastPeriodYear) {
      setError(lastPeriodRequiredText);
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: selectLastPeriodErrorText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    // Validate at least one emergency contact
    const validContacts = contacts.filter(
      (c) => c.name.trim() && c.number.trim() && c.relation
    );

    if (validContacts.length === 0) {
      setError(emergencyContactRequiredText);
      Toast.show({
        type: "error",
        text1: validationErrorText,
        text2: addEmergencyContactErrorText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    // Format date as YYYY-MM-DD
    const monthIndex = months.indexOf(lastPeriodMonth) + 1;
    const formattedMonth = monthIndex.toString().padStart(2, "0");
    const formattedDay = lastPeriodDay.padStart(2, "0");
    const lastPeriodDate = `${lastPeriodYear}-${formattedMonth}-${formattedDay}`;

    // Prepare emergency contact data (use first valid contact for now)
    const primaryContact = validContacts[0];
    const emergencyContact = {
      name: primaryContact.name,
      email: "", // Not collected in current form
      phone: primaryContact.number,
      relationship: primaryContact.relation.toLowerCase(),
    };

    // Prepare profile data
    const profileData = {
      name: fullName.trim(),
      address: address.trim(),
      contact: phoneNumber.trim(),
      lastPeriodDate,
      emergencyContact,
    };

    // Update profile via API
    const result = await updateProfileInformation(profileData);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: profileUpdatedText,
        text2: infoSavedText,
        position: "top",
        visibilityTime: 2000,
      });
      setError("");
      onNext();
    } else {
      setError(result.error || failedToUpdateProfileText);
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
        <ScrollView className="flex-1 p-5 pt-6">
          <Text className="text-2xl font-bold mb-6">{personalInfoText}</Text>
          {/* Full Name */}
          <Text className="text-gray-700 mb-2">{fullNameText}</Text>
          <TextInput
            className="border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 py-[14px] mb-4"
            placeholder={enterFullNameText}
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
          />
          {/* Home Address */}
          <Text className="text-gray-700 mb-2">{homeAddressText}</Text>
          <TextInput
            className="border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 py-[14px] mb-4"
            placeholder={enterAddressText}
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
          />
          {/* Phone Number */}
          <Text className="text-gray-700 mb-2">{yourPhoneNumberText}</Text>
          <View className="flex-row items-center mb-4">
            <View className="w-24 border-y border-l border-gray-300 bg-[#D9D9D9] rounded-l-2xl h-12 justify-center items-center">
              <Text className="text-gray-800 font-medium">+234</Text>
            </View>
            <TextInput
              className="flex-1 border border-gray-300 bg-[#FCFCFC] rounded-r-2xl px-4 h-12"
              placeholder="8012345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>
          {/* Last Period */}
          <Text className="text-gray-700 mb-2">{lastPeriodText}</Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              className="flex-1 mr-2 border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 flex-row items-center justify-between h-12"
              onPress={() => setOpenPicker("month")}
            >
              <Text
                className={`text-gray-800 ${
                  !lastPeriodMonth ? "text-opacity-50" : ""
                }`}
              >
                {lastPeriodMonth || monthText}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 mr-2 border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 flex-row items-center justify-between h-12"
              onPress={() => setOpenPicker("day")}
            >
              <Text
                className={`text-gray-800 ${
                  !lastPeriodDay ? "text-opacity-50" : ""
                }`}
              >
                {lastPeriodDay || dayText}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-32 border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 flex-row items-center justify-between h-12"
              onPress={() => setOpenPicker("year")}
            >
              <Text
                className={`text-gray-800 ${
                  !lastPeriodYear ? "text-opacity-50" : ""
                }`}
              >
                {lastPeriodYear || yearText}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Modal selector for date */}
          <PickerModal
            visible={openPicker !== null}
            options={
              openPicker === "month"
                ? months
                : openPicker === "day"
                ? days
                : years
            }
            onSelect={(item) => handleSelect(openPicker, item)}
            onClose={() => setOpenPicker(null)}
            title={`${selectText} ${openPicker}`}
          />
          <PickerModal
            visible={openRelationPicker !== null}
            options={relationOptions}
            onSelect={(item) => {
              updateContact(openRelationPicker, "relation", item);
              setOpenRelationPicker(null);
            }}
            onClose={() => setOpenRelationPicker(null)}
            title={selectRelationText}
          />
          {/* Emergency Contact */}
          <View className="flex-row items-center justify-between mt-4 mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              {emergencyContactsText}
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-[#006D5B] px-4 py-3 rounded-2xl"
              onPress={addContact}
            >
              <Text className="text-white text-base font-semibold mr-1">+</Text>
              <Text className="text-white font-medium">{addContactText}</Text>
            </TouchableOpacity>
          </View>
          {contacts.map((c, idx) => (
            <View
              key={c.id}
              className="mb-6 border border-gray-200 rounded-2xl p-4 bg-white/30"
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-700 font-medium">
                  {contactText} {idx + 1}
                </Text>
                {contacts.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeContact(c.id)}
                    className="ml-2 px-2 py-1 rounded bg-red-100"
                  >
                    <Text className="text-red-600 text-xs font-semibold">
                      {removeText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Name */}
              <Text className="text-gray-700 mb-2">{nameText}</Text>
              <TextInput
                className="border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 py-[14px] mb-4"
                placeholder={enterNameText}
                placeholderTextColor="#9CA3AF"
                value={c.name}
                onChangeText={(val) => updateContact(c.id, "name", val)}
              />
              {/* Phone split */}
              <Text className="text-gray-700 mb-2">{phoneNumberText}</Text>
              <View className="flex-row items-center mb-2">
                <View className="w-24 border-y border-l border-gray-300 bg-[#D9D9D9] rounded-l-2xl h-12 justify-center items-center">
                  <Text className="text-gray-800 font-medium">+234</Text>
                </View>
                <TextInput
                  className="flex-1 border border-gray-300 bg-[#FCFCFC] rounded-r-2xl px-4 h-12"
                  placeholder="8012345678"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={c.number}
                  onChangeText={(val) => updateContact(c.id, "number", val)}
                  maxLength={10}
                />
              </View>
              {/* Relation selector */}
              <Text className="text-gray-700 mb-2">{relationText}</Text>
              <TouchableOpacity
                className="border border-gray-300 bg-[#FCFCFC] rounded-2xl px-4 h-12 flex-row items-center justify-between mb-4"
                onPress={() => setOpenRelationPicker(c.id)}
              >
                <Text
                  className={`text-gray-800 ${
                    !c.relation ? "text-opacity-50" : ""
                  }`}
                >
                  {c.relation || selectRelationPlaceholderText}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          ))}
          {/* Add Contact button moved above */}
          <View className="flex-row justify-between mt-4 mb-8">
            <TouchableOpacity
              className="bg-[#006D5B] rounded-2xl py-4 px-8"
              onPress={onBack}
              disabled={authLoading}
            >
              <Text className="text-white font-semibold">{backText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#006D5B] rounded-2xl py-4 px-8"
              onPress={handleNext}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-semibold">{nextText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Toast component */}
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
}
