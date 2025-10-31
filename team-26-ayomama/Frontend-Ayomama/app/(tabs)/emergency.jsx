import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../store/useAuthStore";
import useEmergency from "../../store/useEmergeency";
import { useTranslation } from "../../utils/translator";

const Emergency = () => {
  const [tapCount, setTapCount] = useState(0);
  const [showHospitals, setShowHospitals] = useState(false);
  const [coords, setCoords] = useState(null);
  const [noHospitalMessage, setNoHospitalMessage] = useState(false); // 👈 new state

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const {
    emergencyContacts,
    hospitals,
    loading,
    fetchEmergencyContacts,
    fetchNearbyHospitals,
  } = useEmergency();

  useEffect(() => {
    if (token) fetchEmergencyContacts(token);
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Please allow location access to find nearby hospitals.",
          });
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log("Error getting location:", error);
      }
    })();
  }, []);

  const viewHospitalsText = useTranslation("View hospitals near you");
  const emergencyTitleText = useTranslation("Emergency Help Needed?");
  const emergencySubtitleText = useTranslation(
    "We are here to help with everything"
  );
  const tapInstructionText = useTranslation(
    "Tap 3 times to send message to all your emergency contact."
  );
  const emergencyAlertText = useTranslation("Emergency Alert");
  const messageSentText = useTranslation("Message sent to your contacts!");
  const callFailedText = useTranslation("Call Failed 📞");
  const unableToCallText = useTranslation(
    "Unable to make call. Please try again."
  );

  const handleViewHospitals = async () => {
    if (!coords) {
      Toast.show({
        type: "info",
        text1: "Location not ready",
        text2: "Please wait while we fetch your location.",
      });
      return;
    }

    await fetchNearbyHospitals(coords.latitude, coords.longitude);
    setShowHospitals(true);

    setNoHospitalMessage(true);
    setTimeout(() => {
      setNoHospitalMessage(false);
    }, 3000);
  };

  const handleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 4) {
      Toast.show({
        type: "success",
        text1: emergencyAlertText,
        text2: messageSentText,
      });
      setTapCount(0);
    }
  };

  const handleEmergencyCall = (contact) => {
    Alert.alert(
      `Call ${contact.name}?`,
      `Are you sure you want to call ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${contact.phone}`).catch(() => {
              Toast.show({
                type: "error",
                text1: callFailedText,
                text2: unableToCallText,
                position: "top",
              });
            });
          },
        },
      ]
    );
  };

  const getCircleColors = () => {
    switch (tapCount) {
      case 1:
        return { outer: "#FF000020", middle: "#FF000040", inner: "#C70C0C" };
      case 2:
        return { outer: "#0000FF20", middle: "#0000FF40", inner: "#0000FF" };
      case 3:
        return { outer: "#ABC70C40", middle: "#ABC70C80", inner: "#ABC70C" };
      default:
        return { outer: "#FF000020", middle: "#FF000040", inner: "#C70C0C" };
    }
  };

  const colors = getCircleColors();

  const groupedContacts = emergencyContacts.reduce((acc, contact) => {
    const { type } = contact;
    if (!acc[type]) acc[type] = [];
    acc[type].push(contact);
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-[#FCFCFC]">
      <View className="flex-1 items-center justify-between py-10">
        {/* Top Section */}
        <View className="w-full px-5 justify-center flex flex-row">
          <TouchableOpacity
            onPress={handleViewHospitals}
            disabled={loading}
            className="border border-[#00D2B3] w-[200px] justify-center px-3 py-1.5 rounded-full flex-row items-center space-x-1"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#00D2B3" />
            ) : (
              <>
                <Text className="text-[14px]">{viewHospitalsText}</Text>
                <Icon name="directions" size={16} color="#00D2B3" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Center Section */}
        <View className="items-center w-[300px] flex flex-col justify-between h-[50vh]">
          <View>
            <Text className="text-[32px] font-bold text-[#333] text-center mb-2">
              {emergencyTitleText}
            </Text>
            <Text className="text-[15px] text-[#666] mb-8 text-center">
              {emergencySubtitleText}
            </Text>
          </View>

          {/* Triple Circle Button */}
          <TouchableOpacity onPress={handleTap} activeOpacity={0.8}>
            <View className="relative justify-center items-center">
              <View
                className="absolute rounded-full"
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: colors.outer,
                }}
              />
              <View
                className="absolute rounded-full"
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: colors.middle,
                }}
              />
              <View
                className="flex justify-center items-center rounded-full"
                style={{ width: 80, height: 80, backgroundColor: colors.inner }}
              >
                <Icon name="touch-app" size={30} color="#000" />
              </View>
            </View>
          </TouchableOpacity>

          <Text className="text-[#666] text-center mt-8 px-8">
            {tapInstructionText}
          </Text>
        </View>

        {/* Hospital List */}
        {showHospitals && !loading && hospitals.length > 0 && (
          <ScrollView className="w-full px-5 mt-3 mb-3">
            <Text className="font-bold text-[16px] text-center mb-2">
              Nearby Hospitals
            </Text>
            {hospitals.map((hospital, index) => (
              <View
                key={index}
                className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200"
              >
                <Text className="font-semibold text-[15px]">
                  {hospital.name}
                </Text>
                <Text className="text-[13px] text-gray-600">
                  {hospital.address}
                </Text>
                {hospital.distance && (
                  <Text className="text-[12px] text-gray-500">
                    Distance: {hospital.distance.toFixed(2)} km
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {showHospitals &&
          !loading &&
          hospitals.length === 0 &&
          noHospitalMessage && (
            <Text className="text-gray-500 text-center mt-4">
              No nearby hospitals found.
            </Text>
          )}
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default Emergency;
