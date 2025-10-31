import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

// Storage key for translations cache
const TRANSLATIONS_CACHE_KEY = "@ayomama_translations_cache";
const LANGUAGE_KEY = "@ayomama_selected_language";

// Microsoft Translator API configuration
const TRANSLATOR_API_KEY = process.env.EXPO_PUBLIC_TRANSLATOR_API_KEY;
const TRANSLATOR_REGION = process.env.EXPO_PUBLIC_TRANSLATOR_REGION;
const TRANSLATOR_ENDPOINT = process.env.EXPO_PUBLIC_TRANSLATOR_ENDPOINT;

/**
 * Zustand store for managing translations with Microsoft Translator API
 * Features:
 * - Caches translations locally for offline use
 * - Prevents duplicate API calls
 * - Supports multiple languages (en, ha, ig, yo)
 * - Handles loading and error states
 */
const useTranslatorStore = create((set, get) => ({
  // Current selected language (default: English)
  language: "en",

  // Cache of translations: { "text|lang": "translated_text" }
  translationsCache: {},

  // Loading state for translations
  isTranslating: false,

  // Error state
  error: null,

  // Pending translations to avoid duplicate API calls
  pendingTranslations: new Set(),

  /**
   * Initialize the translator store
   * Loads cached translations and saved language preference
   */
  initialize: async () => {
    try {
      // Load saved language preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        set({ language: savedLanguage });
      }

      // Load cached translations
      const cachedTranslations = await AsyncStorage.getItem(
        TRANSLATIONS_CACHE_KEY
      );
      if (cachedTranslations) {
        set({ translationsCache: JSON.parse(cachedTranslations) });
      }
    } catch (error) {
      console.error("Error initializing translator:", error);
    }
  },

  /**
   * Set the selected language
   * @param {string} lang - Language code (en, ha, ig, yo)
   */
  setLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      set({ language: lang, error: null });
    } catch (error) {
      console.error("Error setting language:", error);
      set({ error: "Failed to set language" });
    }
  },

  /**
   * Get cached translation if available
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code
   * @returns {string|null} - Cached translation or null
   */
  getCachedTranslation: (text, targetLang) => {
    const cacheKey = `${text}|${targetLang}`;
    return get().translationsCache[cacheKey] || null;
  },

  /**
   * Save translation to cache
   * @param {string} text - Original text
   * @param {string} targetLang - Target language code
   * @param {string} translation - Translated text
   */
  saveCachedTranslation: async (text, targetLang, translation) => {
    const cacheKey = `${text}|${targetLang}`;
    const updatedCache = {
      ...get().translationsCache,
      [cacheKey]: translation,
    };

    set({ translationsCache: updatedCache });

    try {
      await AsyncStorage.setItem(
        TRANSLATIONS_CACHE_KEY,
        JSON.stringify(updatedCache)
      );
    } catch (error) {
      console.error("Error saving translation to cache:", error);
    }
  },

  /**
   * Translate text using Microsoft Translator API
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (optional, uses current language if not provided)
   * @returns {Promise<string>} - Translated text
   */
  translateText: async (text, targetLang = null) => {
    // If no text provided, return empty string
    if (!text || text.trim() === "") {
      return "";
    }

    // Use current language if no target language specified
    const toLang = targetLang || get().language;

    // If target language is English, return original text
    if (toLang === "en") {
      return text;
    }

    // Check cache first
    const cachedTranslation = get().getCachedTranslation(text, toLang);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // Check if this translation is already pending
    const cacheKey = `${text}|${toLang}`;
    if (get().pendingTranslations.has(cacheKey)) {
      // Wait for pending translation to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const cached = get().getCachedTranslation(text, toLang);
          if (cached) {
            clearInterval(checkInterval);
            resolve(cached);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(text); // Return original text if timeout
        }, 10000);
      });
    }

    // Add to pending translations
    set((state) => ({
      pendingTranslations: new Set(state.pendingTranslations).add(cacheKey),
    }));

    try {
      set({ isTranslating: true, error: null });

      // Call Microsoft Translator API
      const response = await fetch(
        `${TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=${toLang}`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": TRANSLATOR_API_KEY,
            "Ocp-Apim-Subscription-Region": TRANSLATOR_REGION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ text }]),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data[0]?.translations[0]?.text || text;

      // Save to cache
      await get().saveCachedTranslation(text, toLang, translatedText);

      // Remove from pending translations
      set((state) => {
        const newPending = new Set(state.pendingTranslations);
        newPending.delete(cacheKey);
        return { pendingTranslations: newPending };
      });

      set({ isTranslating: false });
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      set({
        error: "Failed to translate text",
        isTranslating: false,
      });

      // Remove from pending translations
      set((state) => {
        const newPending = new Set(state.pendingTranslations);
        newPending.delete(cacheKey);
        return { pendingTranslations: newPending };
      });

      // Return original text on error
      return text;
    }
  },

  /**
   * Translate multiple texts in batch
   * @param {string[]} texts - Array of texts to translate
   * @param {string} targetLang - Target language code (optional)
   * @returns {Promise<string[]>} - Array of translated texts
   */
  translateBatch: async (texts, targetLang = null) => {
    const toLang = targetLang || get().language;

    // If target language is English, return original texts
    if (toLang === "en") {
      return texts;
    }

    const translations = await Promise.all(
      texts.map((text) => get().translateText(text, toLang))
    );

    return translations;
  },

  /**
   * Clear all cached translations
   */
  clearCache: async () => {
    try {
      await AsyncStorage.removeItem(TRANSLATIONS_CACHE_KEY);
      set({ translationsCache: {}, error: null });
    } catch (error) {
      console.error("Error clearing translation cache:", error);
      set({ error: "Failed to clear cache" });
    }
  },

  /**
   * Get cache size for debugging
   * @returns {number} - Number of cached translations
   */
  getCacheSize: () => {
    return Object.keys(get().translationsCache).length;
  },
}));

export default useTranslatorStore;
