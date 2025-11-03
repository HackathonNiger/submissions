import { useEffect, useState } from "react";
import useTranslatorStore from "../store/useTranslatorStore";

/**
 * Custom React hook for translating text
 * Automatically translates text when language changes
 * Shows cached translations instantly
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Optional target language (defaults to current language)
 * @returns {string} - Translated text
 *
 * @example
 * const welcomeText = useTranslation("Welcome to Ayomama");
 * <Text>{welcomeText}</Text>
 */
export const useTranslation = (text, targetLang = null) => {
  const { language, translateText, getCachedTranslation } =
    useTranslatorStore();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    // Skip if no text
    if (!text || text.trim() === "") {
      setTranslatedText("");
      return;
    }

    const lang = targetLang || language;

    // If English, return original text
    if (lang === "en") {
      setTranslatedText(text);
      return;
    }

    // Check cache first for instant display
    const cached = getCachedTranslation(text, lang);
    if (cached) {
      setTranslatedText(cached);
      return;
    }

    // Set original text while translating
    setTranslatedText(text);

    // Translate asynchronously
    translateText(text, lang).then((translated) => {
      setTranslatedText(translated);
    });
  }, [text, language, targetLang]);

  return translatedText;
};

/**
 * Custom React hook for translating multiple texts
 *
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Optional target language
 * @returns {string[]} - Array of translated texts
 *
 * @example
 * const [title, subtitle] = useTranslations(["Welcome", "Get Started"]);
 */
export const useTranslations = (texts, targetLang = null) => {
  const { language, translateBatch } = useTranslatorStore();
  const [translatedTexts, setTranslatedTexts] = useState(texts);

  useEffect(() => {
    const lang = targetLang || language;

    if (lang === "en") {
      setTranslatedTexts(texts);
      return;
    }

    translateBatch(texts, lang).then((translated) => {
      setTranslatedTexts(translated);
    });
  }, [texts.join("|"), language, targetLang]);

  return translatedTexts;
};

/**
 * Higher-order component that wraps a component with translation support
 *
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} - Wrapped component with translation props
 *
 * @example
 * const TranslatedScreen = withTranslation(MyScreen);
 */
export const withTranslation = (Component) => {
  return (props) => {
    const { translateText, language, isTranslating } = useTranslatorStore();

    return (
      <Component
        {...props}
        t={translateText}
        language={language}
        isTranslating={isTranslating}
      />
    );
  };
};

/**
 * Translate static strings synchronously (from cache only)
 * Use this for non-component translations
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language
 * @returns {string} - Translated text or original if not cached
 *
 * @example
 * const translatedTitle = translateSync("Welcome", "ha");
 */
export const translateSync = (text, targetLang) => {
  const cached = useTranslatorStore
    .getState()
    .getCachedTranslation(text, targetLang);
  return cached || text;
};
