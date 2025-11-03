import { create } from "zustand";
import api from "../api";

const useVisitStore = create((set, get) => ({
  visits: [],
  loading: false,
  error: null,

  //  Create new visit schedule
  createSchedule: async (visitData) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post("/api/visit/create_schedule", visitData);

      if (response.status === 201 || response.status === 200) {
        await get().fetchVisits();
        set({ loading: false });
        return { success: true, message: "Visit scheduled successfully" };
      } else {
        throw new Error(response.data.message || "Failed to create visit");
      }
    } catch (error) {
      console.error(
        "Create visit error:",
        error.response?.data || error.message
      );
      set({ loading: false, error: error.message });
      return {
        success: false,
        error: error.response?.data?.error || "Error creating schedule",
      };
    }
  },

  // Fetch all visits
  fetchVisits: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/api/visit/get_visits");
      console.log("Fetch visits response:", response.data);

      if (response.status === 200 && Array.isArray(response.data.visits)) {
        set({ visits: response.data.visits, loading: false });
      } else {
        throw new Error("Failed to fetch visits");
      }
    } catch (error) {
      console.error("Fetch visits error:", error);
      set({ loading: false, error: "Error fetching visits" });
    }
  },
}));

export default useVisitStore;
