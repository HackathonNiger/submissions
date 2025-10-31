import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTranslation } from "../../utils/translator";

const ios = Platform.OS === "ios";

export default function Security() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Translate all text
  const changePasswordText = useTranslation("Change Password");
  const oldPasswordText = useTranslation("Old Password");
  const newPasswordText = useTranslation("New Password");
  const confirmPasswordText = useTranslation("Confirm Password");
  const saveText = useTranslation("Save");

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: Implement password change logic with API
    if (newPassword !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }
    console.log("Changing password");
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#FCFCFC]">
        {/* Gradient Background at Top */}
        <LinearGradient
          colors={["#BCF2E9", "#FCFCFC"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

        <View className="flex-1">
          {/* Header with Back Button and Title */}
          <View
            className="px-6 flex-row items-center"
            style={{ paddingTop: ios ? 64 : 76 }}
          >
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#293231" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-[#293231] ml-[65px]">
              {changePasswordText}
            </Text>
          </View>

          {/* Password Form */}
          <View className="px-6 mt-16">
            {/* Old Password */}
            <Text className="text-[15px] font-semibold text-[#293231] mb-3">
              {oldPasswordText}
            </Text>
            <View className="bg-white rounded-2xl mb-6 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="**********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showOldPassword}
                className="flex-1 text-[16px] text-[#293231]"
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                <Ionicons
                  name={showOldPassword ? "eye-off" : "pencil"}
                  size={18}
                  color="#293231"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <Text className="text-[15px] font-semibold text-[#293231] mb-3">
              {newPasswordText}
            </Text>
            <View className="bg-white rounded-2xl mb-6 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="**********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
                className="flex-1 text-[16px] text-[#293231]"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "pencil"}
                  size={18}
                  color="#293231"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text className="text-[15px] font-semibold text-[#293231] mb-3">
              {confirmPasswordText}
            </Text>
            <View className="bg-white rounded-2xl mb-8 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="**********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                className="flex-1 text-[16px] text-[#293231]"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "pencil"}
                  size={18}
                  color="#293231"
                />
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-[#BCF2E9] rounded-2xl h-[56px] items-center justify-center mt-8"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className="text-[#293231] font-semibold text-[16px]">
                {saveText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
