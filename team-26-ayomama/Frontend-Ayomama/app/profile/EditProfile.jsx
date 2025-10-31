import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

const ios = Platform.OS === "ios";

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Initialize state with user data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Translate all text
  const editProfileText = useTranslation("Edit Profile");
  const enterNameText = useTranslation("Enter your name");
  const enterEmailText = useTranslation("Enter your email");
  const enterPhoneText = useTranslation("Enter your phone number");
  const saveText = useTranslation("Save");

  // Get avatar source - use profilepic.png as default
  const getAvatarSource = () => {
    if (
      user?.avatar &&
      typeof user.avatar === "string" &&
      user.avatar.trim() !== ""
    ) {
      return { uri: user.avatar };
    } else if (user?.avatar && typeof user.avatar === "object") {
      return user.avatar;
    } else {
      return require("../../assets/images/profilepic.png");
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = () => {
    // TODO: Implement save profile logic with API
    console.log("Saving profile:", { name, email, phone });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const handleChangePhoto = () => {
    // TODO: Implement photo picker
    console.log("Change photo");
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
            height: 280,
          }}
        />

        <View className="flex-1">
          {/* Header with Back Button */}
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
          </View>

          {/* Profile Image Section */}
          <View className="items-center mt-8 mb-12">
            <View className="relative">
              <Image
                source={getAvatarSource()}
                className="w-24 h-28 rounded-3xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={handleChangePhoto}
                className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              >
                <Ionicons name="pencil" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Edit Profile Form */}
          <View className="px-6">
            <Text className="text-lg font-bold text-[#293231] mb-6">
              {editProfileText}
            </Text>

            {/* Name Input */}
            <View className="bg-white rounded-2xl mb-4 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={enterNameText}
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-[16px] text-[#293231]"
              />
              <Ionicons name="pencil" size={18} color="#293231" />
            </View>

            {/* Email Input */}
            <View className="bg-white rounded-2xl mb-4 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={enterEmailText}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-[16px] text-[#293231]"
              />
              <Ionicons name="pencil" size={18} color="#293231" />
            </View>

            {/* Phone Input */}
            <View className="bg-white rounded-2xl mb-8 px-4 py-[14px] flex-row items-center justify-between border border-[#E5E5E5]">
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={enterPhoneText}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                className="flex-1 text-[16px] text-[#293231]"
              />
              <Ionicons name="pencil" size={18} color="#293231" />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-[#BCF2E9] rounded-2xl h-[56px] items-center justify-center"
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
