import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import api from "../api";

const CHAT_STORAGE_KEY = "@ayomama_chat_session";
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const WARNING_THRESHOLD = 4 * 1024 * 1024; // Warn at 4MB

const useAiStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
  lastMessageId: null, // Track the last message that should stream
  storageWarning: false,

  // Check storage size
  checkStorageSize: async () => {
    try {
      const savedSession = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedSession) {
        const sizeInBytes = new Blob([savedSession]).size;

        if (sizeInBytes >= MAX_STORAGE_SIZE) {
          set({ error: "storage_full" });
          return false;
        } else if (sizeInBytes >= WARNING_THRESHOLD) {
          set({ storageWarning: true });
        } else {
          set({ storageWarning: false });
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking storage size:", error);
      return true;
    }
  },

  // Initialize chat session from AsyncStorage
  initializeSession: async () => {
    try {
      const savedSession = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedSession) {
        const { messages, sessionId } = JSON.parse(savedSession);
        // Mark all existing messages as already displayed (no streaming)
        set({ messages, sessionId, lastMessageId: null });
      } else {
        // Create new session
        const newSessionId = Date.now().toString();
        set({ sessionId: newSessionId, messages: [], lastMessageId: null });
      }

      // Check storage size after initialization
      await get().checkStorageSize();
    } catch (error) {
      console.error("Error initializing chat session:", error);
      set({ error: "Failed to load chat history" });
    }
  },

  // Save messages to AsyncStorage
  saveSession: async () => {
    try {
      const { messages, sessionId } = get();
      await AsyncStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({ messages, sessionId })
      );
    } catch (error) {
      console.error("Error saving chat session:", error);
    }
  },

  // Send message to AI
  sendMessage: async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    // Save after adding user message
    await get().saveSession();

    try {
      // Use the api instance which automatically includes the token
      const response = await api.post("/api/chat", { content });

      console.log("AI chat response:", response.data);

      // Parse the streamed response
      let aiContent = "";

      if (typeof response.data === "string") {
        // Response is a stream of "data: <text>" lines
        const lines = response.data.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataContent = line.substring(6);
            if (dataContent && dataContent.trim()) {
              aiContent += dataContent;
            }
          }
        }

        // Better formatting: Clean up spacing and handle lists properly
        aiContent = aiContent
          .replace(/\s+/g, " ") // Normalize all whitespace to single spaces
          .replace(/\s*\.\s*/g, ". ") // Proper spacing after periods
          .replace(/\s*,\s*/g, ", ") // Proper spacing after commas
          .replace(/\s*!\s*/g, "! ") // Proper spacing after exclamations
          .replace(/\s*\?\s*/g, "? ") // Proper spacing after questions
          .replace(/\s*:\s*/g, ": ") // Proper spacing after colons
          .replace(/(\d+)\s*\.\s*\*\*/g, "\n\n$1. **") // Format numbered list with bold
          .replace(/\*\*\s*:/g, "**: ") // Fix bold list item titles
          .replace(/\.\s+([A-Z])/g, ".\n\n$1") // Paragraph breaks between sentences
          .replace(/\n{3,}/g, "\n\n") // No more than double line breaks
          .trim();
      } else if (response.data.reply) {
        // Regular JSON response
        aiContent = response.data.reply;
      } else if (response.data.message) {
        aiContent = response.data.message;
      } else {
        aiContent = "I'm here to help!";
      }

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        content: aiContent || "I'm here to help!",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
        lastMessageId: aiMessageId, // Mark this as the message to stream
      }));

      // Save after adding AI response
      await get().saveSession();

      // Check storage size after saving
      await get().checkStorageSize();

      return { success: true, message: aiMessage };
    } catch (error) {
      console.error("Error sending message to AI:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send message",
      }));

      await get().saveSession();

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send message",
      };
    }
  },

  // Clear chat session
  clearSession: async () => {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      set({ messages: [], sessionId: null, error: null });
    } catch (error) {
      console.error("Error clearing chat session:", error);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAiStore;
