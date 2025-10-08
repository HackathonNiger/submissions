import * as Location from "expo-location";
import { useState } from "react";
import Toast from "react-native-toast-message";
import api from "../api";
import useAuthStore from "../store/useAuthStore";

const useHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const fetchNearbyHospitals = async () => {
    try {
      setLoading(true);

      // Ask for permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Location access is required to find nearby hospitals.",
          position: "top",
        });
        return;
      }

      // Get current device location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords || {};

      if (!latitude || !longitude) {
        Toast.show({
          type: "error",
          text1: "Location Error",
          text2: "Unable to retrieve your current coordinates.",
          position: "top",
        });
        return;
      }

      console.log("Sending coordinates:", { latitude, longitude });

      // Send request to backend
      const response = await api.post(
        "/api/hospitals",
        { latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const hospitalsList = response.data?.hospitals || [];

      setHospitals(hospitalsList);

      if (hospitalsList.length > 0) {
        Toast.show({
          type: "success",
          text1: "Hospitals Found",
          text2: `${hospitalsList.length} nearby hospital(s) located.`,
          position: "top",
        });
      } else {
        Toast.show({
          type: "info",
          text1: "No Hospitals Found",
          text2: "No nearby hospitals detected within your area.",
          position: "top",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching hospitals:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch nearby hospitals.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    hospitals,
    loading,
    fetchNearbyHospitals,
  };
};

export default useHospital;
