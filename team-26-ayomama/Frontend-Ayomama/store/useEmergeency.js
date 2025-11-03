import { create } from "zustand";
import api from "../api";

const useEmergency = create((set) => ({
  emergencyContacts: [],
  hospitals: [],
  loading: false,

  //Fetch emergency contacts
  fetchEmergencyContacts: async (token) => {
    try {
      set({ loading: true });
      const response = await api.get("/api/user/emergency-contact", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ emergencyContacts: response.data.contacts || [], loading: false });
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      set({ loading: false });
    }
  },

  // Fetch nearby hospitals
  fetchNearbyHospitals: async (latitude, longitude) => {
    try {
      set({ loading: true });
      const response = await api.post("/api/hospitals", {
        latitude,
        longitude,
      });
      set({ hospitals: response.data.hospitals || [], loading: false });
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      set({ loading: false });
    }
  },
}));

export default useEmergency;
