"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser } from "./auth";
import { useLanguage } from "./language-context";
import { createNigerianUtterance } from "./voice-utils";
import { lessons } from "./lessons-data";
import { createModel, KaldiRecognizer } from "vosk-browser";
import { findBestCommandMatch, preprocessASRText } from "./text-recognition";

// --- IMPORTANT ---
// You need to provide the URL to your Vosk model.
// For testing, you can use a small English model and host it in your /public folder.
// Download a model from: https://alphacephei.com/vosk/models
const VOSK_MODEL_URL = "/vosk-model-small-en-us-0.15.zip"; // Example path

interface AudioNavigationContextType {
  isAudioNavigationMode: boolean;
  isListening: boolean;
  currentFocus: string | null;
  availableCommands: string[];
  showDeactivationMessage: boolean;
  announcement: string;
  toggleAudioNavigationMode: () => void;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string, priority?: "low" | "medium" | "high") => void;
  announceCurrentFocus: () => void;
  setCurrentFocus: (focus: string | null) => void;
  setAnnouncement: (text: string) => void;
    announcePage: (path: string, text: string, priority?: "low" | "medium" | "high") => void;   
}

const VoskAudioNavigationContext = createContext<
  AudioNavigationContextType | undefined
>(undefined);

export function VoskAudioNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAudioNavigationMode, setIsAudioNavigationMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [speechQueue, setSpeechQueue] = useState<
    Array<{ text: string; priority: "low" | "medium" | "high" }>
  >([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDeactivationMessage, setShowDeactivationMessage] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [model, setModel] = useState<any | null>(null);

  const recognizerRef = useRef<KaldiRecognizer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isAudioNavigationModeRef = useRef(isAudioNavigationMode);
  const mountedRef = useRef(mounted);
  const isSpeakingRef = useRef(isSpeaking);
  const helpRepetitionCounter = useRef(0);
  const pageAnnouncementTracker = useRef<Record<string, boolean>>({});
  const lastAnnouncedPath = useRef<string | null>(null);

  const router = useRouter();
  const { language, t } = useLanguage();

  useEffect(() => {
    isAudioNavigationModeRef.current = isAudioNavigationMode;
  }, [isAudioNavigationMode]);

  useEffect(() => {
    mountedRef.current = mounted;
  }, [mounted]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableCommands = [
    "basic math",
    "intermediate math",
    "algebra",
    "start practice",
    "read question",
    "next question",
    "repeat question",
    "stop practice",
    "exit",
    "help",
  ];

  const speakText = useCallback(
    (text: string, priority: "low" | "medium" | "high" = "medium", forcePath: string | null = null) => {
      if (!text) return;

      const currentPath = window.location.pathname;
      if (forcePath === currentPath && lastAnnouncedPath.current === currentPath) {
        console.log(`[AudioNav] Announcement for ${currentPath} already made. Skipping.`);
        return;
      }
      
      if (forcePath) {
        lastAnnouncedPath.current = forcePath;
      }

      setAnnouncement(text);
      setSpeechQueue((prev) => {
        const newItem = { text, priority };
        if (priority === "high") return [newItem, ...prev];
        if (priority === "low") return [...prev, newItem];
        const highPriorityItems = prev.filter(
          (item) => item.priority === "high"
        );
        const nonHighPriorityItems = prev.filter(
          (item) => item.priority !== "high"
        );
        return [...highPriorityItems, newItem, ...nonHighPriorityItems];
      });
    },
    []
  );

  const announceCurrentFocus = useCallback(() => {
    if (currentFocus) {
      speakText(`Currently focused on: ${currentFocus}`, "medium");
    } else {
      speakText(
        "No current focus. Say 'help' for available commands.",
        "medium"
      );
    }
  }, [currentFocus, speakText]);

  const announcePage = useCallback((path: string, text: string, priority: "low" | "medium" | "high" = "medium") => {
    if (pageAnnouncementTracker.current[path]) {
      console.log(`[AudioNav] Page announcement for ${path} already made. Skipping.`);
      return;
    }
    speakText(text, priority);
    pageAnnouncementTracker.current[path] = true;
  }, [speakText]);

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking && "speechSynthesis" in window) {
      const nextItem = speechQueue[0];
      setSpeechQueue((prev) => prev.slice(1));
      setIsSpeaking(true);

      // Add a delay before speaking the next item
      setTimeout(() => {
        const user = getUser();
        const userSettings = user?.settings
          ? {
              audioSpeed: user.settings.audioSpeed,
              audioPitch: user.settings.audioPitch,
            }
          : undefined;
        const utterance =
          language !== "english"
            ? createNigerianUtterance(nextItem.text, language, userSettings)
            : new SpeechSynthesisUtterance(nextItem.text);

        if (language === "english") {
          utterance.lang = "en-US";
          const audioSpeed = userSettings?.audioSpeed ?? "normal";
          utterance.rate =
            audioSpeed === "slow" ? 0.7 : audioSpeed === "very-slow" ? 0.5 : 0.9;
          utterance.pitch = userSettings?.audioPitch === "high" ? 1.2 : 1;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }, 500); 
    }
  }, [speechQueue, isSpeaking, language]);

  const stopListening = useCallback(() => {
    console.log("🛑 [Vosk] Stopping recognition");
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.remove();
      recognizerRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleAudioNavigationMode = useCallback(() => {
    const newMode = !isAudioNavigationMode;
    setIsAudioNavigationMode(newMode);

    const user = getUser();
    if (user) {
      updateUser({ settings: { ...user.settings, audioNavigation: newMode } });
    }

    if (newMode) {
      // Welcome messages logic remains the same
      setTimeout(() => {
        speakText("Audio navigation activated with Vosk.", "high");
      }, 500);
    } else {
      stopListening();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      setSpeechQueue([]);
      setIsSpeaking(false);
      pageAnnouncementTracker.current = {}; // Reset tracker
      setShowDeactivationMessage(true);
      setTimeout(() => {
        setShowDeactivationMessage(false);
        speakText("Audio navigation mode deactivated.", "high");
      }, 100);
    }
  }, [isAudioNavigationMode, speakText, stopListening]);

  const handleVoiceCommand = useCallback(
    (command: string) => {
      console.log("🗣️ [Vosk] Processing command:", command);
  const normalizedCommand = command.toLowerCase().trim();
  const preprocessed = preprocessASRText(normalizedCommand);

      // Fuzzy global navigation using Levenshtein-based matcher
      const fuzzy = (candidates: string[], threshold = 0.58) =>
        !!findBestCommandMatch(preprocessed || normalizedCommand, candidates, {
          threshold,
          allowPartial: true,
          preferLonger: true,
        });

      if (
        fuzzy([
          'dashboard',
          'dash board',
          'dark book',
          'dash',
          'board',
          'go dashboard',
          'go to dashboard',
        ]) || /\b(zuwa\s*dashboard|dashboard\s*zuwa)\b/i.test(normalizedCommand)
      ) {
        const message = t("goingToDashboard", {
          english: "Going to Dashboard",
          hausa: "Zuwa Dashboard",
          kanuri: "Dashboard zuwa",
          arabic: "الانتقال إلى لوحة القيادة",
        });
        setSpeechQueue([]); // Clear queue
        setAnnouncement(message);
        speakText(message, "medium");
        router.push("/dashboard");
        return;
      }

      if (
        fuzzy(['progress', 'prog', 'go progress', 'go to progress', 'progress page']) || /\b(zuwa\s*progress|progress\s*zuwa)\b/i.test(normalizedCommand)
      ) {
        const message = t("goingToProgress", {
          english: "Going to Progress",
          hausa: "Zuwa Ci gaba",
          kanuri: "Ci gaba zuwa",
          arabic: "الانتقال إلى التقدم",
        });
        setAnnouncement(message);
        speakText(message, "medium");
        router.push("/progress");
        return;
      }

      if (
        fuzzy(['settings', 'set', 'go settings', 'go to settings', 'settings page']) || /\b(zuwa\s*settings|settings\s*zuwa)\b/i.test(normalizedCommand)
      ) {
        const message = t("goingToSettings", {
          english: "Going to Settings",
          hausa: "Zuwa Saitunan",
          kanuri: "Saitunan zuwa",
          arabic: "الانتقال إلى الإعدادات",
        });
        setAnnouncement(message);
        speakText(message, "medium");
        router.push("/settings");
        return;
      }

      if (
        fuzzy(['lessons', 'lesson', 'go lessons', 'go to lessons', 'topics']) || /\b(zuwa\s*darussa|darussa\s*zuwa)\b/i.test(normalizedCommand)
      ) {
        const message = t("goingToLessons", {
          english: "Going to Lessons",
          hausa: "Zuwa Darussa",
          kanuri: "Darussa zuwa",
          arabic: "الانتقال إلى الدروس",
        });
        setAnnouncement(message);
        speakText(message, "medium");
        router.push("/topics/basic");
        return;
      }

      if (
        fuzzy(['back', 'go back', 'return', 'koma baya']) || /\b(koma\s*baya|baya\s*koma)\b/i.test(normalizedCommand)
      ) {
        const message = t("goingBack", {
          english: "Going back",
          hausa: "Koma baya",
          kanuri: "Baya koma",
          arabic: "العودة",
        });
        setAnnouncement(message);
        speakText(message, "medium");
        router.back();
        return;
      }

      if (
        fuzzy(['exit', 'quit', 'stop', 'fita']) || /\b(fita|dakatar)\b/i.test(normalizedCommand)
      ) {
        stopListening();

        if ("speechSynthesis" in window) {
          speechSynthesis.cancel();
        }
        setSpeechQueue([]);
        setIsSpeaking(false);

        setIsAudioNavigationMode(false);
        const user = getUser();
        if (user) {
          updateUser({
            settings: {
              ...user.settings,
              audioNavigation: false,
            },
          });
        }

        setShowDeactivationMessage(true);
        setTimeout(() => {
          setShowDeactivationMessage(false);
          const message = t("audioNavDeactivated", {
            english: "Audio navigation mode deactivated.",
            hausa: "An kashe yanayin kewayawa da murya.",
            kanuri: "Murya kewayawa yanayi kashe.",
            arabic: "تم إلغاء تفعيل وضع التنقل الصوتي.",
          });
          setAnnouncement(message);
          speakText(message, "high");
        }, 100);
        return;
      }

      // Settings-specific commands
      if (window.location.pathname === "/settings") {
        if (
          /\b(toggle\s*audio\s*navigation)\b/i.test(normalizedCommand) ||
          /\b(kunna\s*kewayawa\s*da\s*murya)\b/i.test(normalizedCommand)
        ) {
          toggleAudioNavigationMode();
          return;
        }
        if (
          /\b(toggle\s*dyslexia\s*font)\b/i.test(normalizedCommand) ||
          /\b(kunna\s*rubutun\s*dyslexia)\b/i.test(normalizedCommand)
        ) {
          const user = getUser();
          if (user) {
            updateUser({
              settings: {
                ...user.settings,
                dyslexiaFont: !user.settings.dyslexiaFont,
              },
            });
            const message = t(
              user.settings.dyslexiaFont
                ? "dyslexiaFontDisabled"
                : "dyslexiaFontEnabled",
              {
                english: user.settings.dyslexiaFont
                  ? "Dyslexia font disabled"
                  : "Dyslexia font enabled",
                hausa: user.settings.dyslexiaFont
                  ? "Rubutun dyslexia kashe"
                  : "Rubutun dyslexia kunna",
                kanuri: user.settings.dyslexiaFont
                  ? "Rubutun dyslexia kashe"
                  : "Rubutun dyslexia kunna",
                arabic: user.settings.dyslexiaFont
                  ? "تم تعطيل خط الديسلكسيا"
                  : "تم تفعيل خط الديسلكسيا",
              }
            );
            setAnnouncement(message);
            speakText(message, "medium");
          }
          return;
        }
        if (
          /\b(toggle\s*subtitles)\b/i.test(normalizedCommand) ||
          /\b(kunna\s*rubutu)\b/i.test(normalizedCommand)
        ) {
          const user = getUser();
          if (user) {
            updateUser({
              settings: {
                ...user.settings,
                subtitles: !user.settings.subtitles,
              },
            });
            const message = t(
              user.settings.subtitles
                ? "subtitlesDisabled"
                : "subtitlesEnabled",
              {
                english: user.settings.subtitles
                  ? "Subtitles disabled"
                  : "Subtitles enabled",
                hausa: user.settings.subtitles
                  ? "Rubutu kashe"
                  : "Rubutu kunna",
                kanuri: user.settings.subtitles
                  ? "Rubutu kashe"
                  : "Rubutu kunna",
                arabic: user.settings.subtitles
                  ? "تم تعطيل النصوص التوضيحية"
                  : "تم تفعيل النصوص التوضيحية",
              }
            );
            setAnnouncement(message);
            speakText(message, "medium");
          }
          return;
        }
        if (
          /\b(change\s*language)\b/i.test(normalizedCommand) ||
          /\b(canza\s*harshe)\b/i.test(normalizedCommand)
        ) {
          const message = t("languageSelectorOpened", {
            english: "Language selector opened",
            hausa: "Zabin harshe ya buɗe",
            kanuri: "Zabin harshe ya buɗe",
            arabic: "تم فتح محدد اللغة",
          });
          setAnnouncement(message);
          speakText(message, "medium");
          window.dispatchEvent(
            new CustomEvent("audioNavigationCommand", {
              detail: { command: "changeLanguage" },
            })
          );
          return;
        }
        if (
          /\b(change\s*audio\s*speed)\b/i.test(normalizedCommand) ||
          /\b(canza\s*saurin\s*sauti)\b/i.test(normalizedCommand)
        ) {
          const user = getUser();
          if (user) {
            const speeds = ["normal", "slow", "very-slow"] as const;
            const currentIndex = speeds.indexOf(user.settings.audioSpeed);
            const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
            updateUser({
              settings: {
                ...user.settings,
                audioSpeed: nextSpeed,
              },
            });
            const message = t("audioSpeedChanged", {
              english: `Audio speed changed to ${nextSpeed}`,
              hausa: `Saurin sauti ya canza zuwa ${nextSpeed}`,
              kanuri: `Saurin sauti ya canza zuwa ${nextSpeed}`,
              arabic: `تم تغيير سرعة الصوت إلى ${nextSpeed}`,
            });
            setAnnouncement(message);
            speakText(message, "medium");
          }
          return;
        }
        if (
          /\b(change\s*audio\s*pitch)\b/i.test(normalizedCommand) ||
          /\b(canza\s*sautin\s*sauti)\b/i.test(normalizedCommand)
        ) {
          const user = getUser();
          if (user) {
            const pitches = ["normal", "high"] as const;
            const currentIndex = pitches.indexOf(user.settings.audioPitch);
            const nextPitch = pitches[(currentIndex + 1) % pitches.length];
            updateUser({
              settings: {
                ...user.settings,
                audioPitch: nextPitch,
              },
            });
            const message = t("audioPitchChanged", {
              english: `Audio pitch changed to ${nextPitch}`,
              hausa: `Sautin sauti ya canza zuwa ${nextPitch}`,
              kanuri: `Sautin sauti ya canza zuwa ${nextPitch}`,
              arabic: `تم تغيير نبرة الصوت إلى ${nextPitch}`,
            });
            setAnnouncement(message);
            speakText(message, "medium");
          }
          return;
        }
      }

      // Lesson-specific commands
      if (window.location.pathname.includes("/lesson/")) {
        const lessonId = window.location.pathname.split("/").pop();
        const currentLesson = lessons.find((l: any) => l.id === lessonId);

        if (
          /\b(st(?:art)?\s*practice)\b/i.test(normalizedCommand) ||
          /\b(fara\s*aiki)\b/i.test(normalizedCommand)
        ) {
          window.dispatchEvent(
            new CustomEvent("audioNavigationCommand", {
              detail: { command: "startPractice" },
            })
          );
          return;
        }

        if (
          /\b(read\s*question|repeat\s*question)\b/i.test(normalizedCommand) ||
          /\b(karanta\s*tambaya|maimaita\s*tambaya)\b/i.test(normalizedCommand)
        ) {
          window.dispatchEvent(
            new CustomEvent("audioNavigationCommand", {
              detail: { command: "readQuestion" },
            })
          );
          return;
        }

        if (
          /\b(next\s*question)\b/i.test(normalizedCommand) ||
          /\b(tambaya\s*ta\s*gaba)\b/i.test(normalizedCommand)
        ) {
          window.dispatchEvent(
            new CustomEvent("audioNavigationCommand", {
              detail: { command: "nextQuestion" },
            })
          );
          return;
        }

        if (
          /\b(stop\s*practice)\b/i.test(normalizedCommand) ||
          /\b(dakatar\s*da\s*aiki)\b/i.test(normalizedCommand)
        ) {
          window.dispatchEvent(
            new CustomEvent("audioNavigationCommand", {
              detail: { command: "stopPractice" },
            })
          );
          return;
        }

        // Handle answer selection
        if (currentLesson) {
          // Try to get current question index from the lesson page state
          // Since we can't access the component state directly, we'll use a more generic approach
          const currentQuestionIndex = 0; // This will be handled by the lesson component
          const allOptions = currentLesson.questions.flatMap(
            (q: any) => q.options || []
          );

          const matchedOption = allOptions.find(
            (option: any) =>
              option.toLowerCase().includes(normalizedCommand) ||
              normalizedCommand.includes(option.toLowerCase())
          );

          if (matchedOption) {
            window.dispatchEvent(
              new CustomEvent("audioNavigationCommand", {
                detail: { command: "genericCommand", text: matchedOption },
              })
            );
            return;
          }

          const numberMatch = normalizedCommand.match(/\d+/);
          if (numberMatch) {
            const number = parseInt(numberMatch[0]);
            const numberOption = allOptions.find((option: any) =>
              option.includes(number.toString())
            );
            if (numberOption) {
              window.dispatchEvent(
                new CustomEvent("audioNavigationCommand", {
                  detail: { command: "genericCommand", text: numberOption },
                })
              );
              return;
            }
          }
        }
      }

      // Topic-specific commands (fuzzy match to tolerate ASR errors like "basic months")
      const topicMatch = findBestCommandMatch(normalizedCommand, [
        "basic math",
        "intermediate math",
        "algebra",
      ], { threshold: 0.58, allowPartial: true });

      if (topicMatch) {
        const cmd = topicMatch.command.toLowerCase();
        if (cmd.includes("basic")) {
          setAnnouncement(
            t("goingToBasic", {
              english: "Going to Basic Math",
              hausa: "Zuwa Lissafin Asali",
              kanuri: "Lissafin Asali zuwa",
              arabic: "الانتقال إلى الرياضيات الأساسية",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/basic");
          return;
        }
        if (cmd.includes("intermediate")) {
          setAnnouncement(
            t("goingToIntermediate", {
              english: "Going to Intermediate Math",
              hausa: "Zuwa Lissafin Matsakaici",
              kanuri: "Lissafin Matsakaici zuwa",
              arabic: "الانتقال إلى الرياضيات المتوسطة",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/intermediate");
          return;
        }
        if (cmd.includes("algebra")) {
          setAnnouncement(
            t("goingToAlgebra", {
              english: "Going to Algebra",
              hausa: "Zuwa Algebra",
              kanuri: "Algebra zuwa",
              arabic: "الانتقال إلى الجبر",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/algebra");
          return;
        }
      }

      // Fallback: language-specific exact checks (keep existing translations)
      if (language !== 'english') {
        if (/\b(lissafin\s*farko|lissafi\s*na\s*asali)\b/i.test(normalizedCommand)) {
          setAnnouncement(
            t("goingToBasic", {
              english: "Going to Basic Math",
              hausa: "Zuwa Lissafin Asali",
              kanuri: "Lissafin Asali zuwa",
              arabic: "الانتقال إلى الرياضيات الأساسية",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/basic");
          return;
        }
        if (/\b(lissafin\s*matsakaici|lissafi\s*na\s*matsakaici)\b/i.test(normalizedCommand)) {
          setAnnouncement(
            t("goingToIntermediate", {
              english: "Going to Intermediate Math",
              hausa: "Zuwa Lissafin Matsakaici",
              kanuri: "Lissafin Matsakaici zuwa",
              arabic: "الانتقال إلى الرياضيات المتوسطة",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/intermediate");
          return;
        }
        if (/\b(algebra)\b/i.test(normalizedCommand)) {
          setAnnouncement(
            t("goingToAlgebra", {
              english: "Going to Algebra",
              hausa: "Zuwa Algebra",
              kanuri: "Algebra zuwa",
              arabic: "الانتقال إلى الجبر",
            })
          );
          speakText(announcement, "medium");
          router.push("/topics/algebra");
          return;
        }
      }

      const startPracticeCommands = {
        english: ["start practice", "begin practice", "start"],
        hausa: ["fara aiki", "fara horawa"],
        kanuri: ["fara aiki", "fara horawa"],
        arabic: ["ابدأ التمرين", "ابدأ"],
      };
      // Add missing block for startPracticeCommands
      if (
        startPracticeCommands[language].some((cmd) =>
          normalizedCommand.includes(cmd)
        )
      ) {
        setAnnouncement(
          t("startingPractice", {
            english: "Starting practice",
            hausa: "Fara aiki",
            kanuri: "Fara aiki",
            arabic: "بدء التمرين",
          })
        );
        speakText(announcement, "medium");
        window.dispatchEvent(
          new CustomEvent("audioNavigationCommand", {
            detail: { command: "startPractice" },
          })
        );
        return;
      }

      // Add these command objects before their usage (e.g., above handleVoiceCommand)
      const readQuestionCommands = {
        english: ["read question", "repeat question"],
        hausa: ["karanta tambaya", "maimaita tambaya"],
        kanuri: ["karanta tambaya", "maimaita tambaya"],
        arabic: ["قراءة السؤال", "كرر السؤال"],
      };
      const nextQuestionCommands = {
        english: ["next question"],
        hausa: ["tambaya ta gaba"],
        kanuri: ["tambaya ta gaba"],
        arabic: ["السؤال التالي"],
      };
      const stopPracticeCommands = {
        english: ["stop practice"],
        hausa: ["dakatar da aiki"],
        kanuri: ["dakatar da aiki"],
        arabic: ["إيقاف التمرين"],
      };
      const helpCommands = {
        english: ["help"],
        hausa: ["taimako"],
        kanuri: ["taimako"],
        arabic: ["مساعدة"],
      };
      
            if (
              readQuestionCommands[language].some((cmd) =>
                normalizedCommand.includes(cmd)
              )
            ) {
              setAnnouncement(
                t("readingQuestion", {
                  english: "Reading question",
                  hausa: "Karanta tambaya",
                  kanuri: "Karanta tambaya",
                  arabic: "قراءة السؤال",
                })
              );
              speakText(announcement, "medium");
              window.dispatchEvent(
                new CustomEvent("audioNavigationCommand", {
                  detail: { command: "readQuestion" },
                })
              );
              return;
            }
      
            if (
              nextQuestionCommands[language].some((cmd) =>
                normalizedCommand.includes(cmd)
              )
            ) {
              setAnnouncement(
                t("nextQuestion", {
                  english: "Moving to next question",
                  hausa: "Tambaya ta gaba",
                  kanuri: "Tambaya ta gaba",
                  arabic: "الانتقال إلى السؤال التالي",
                })
              );
              speakText(announcement, "medium");
              window.dispatchEvent(
                new CustomEvent("audioNavigationCommand", {
                  detail: { command: "nextQuestion" },
                })
              );
              return;
            }
      
            if (
              stopPracticeCommands[language].some((cmd) =>
                normalizedCommand.includes(cmd)
              )
            ) {
              setAnnouncement(
                t("stoppingPractice", {
                  english: "Stopping practice",
                  hausa: "Dakatar da aiki",
                  kanuri: "Dakatar da aiki",
                  arabic: "إيقاف التمرين",
                })
              );
              speakText(announcement, "medium");
              window.dispatchEvent(
                new CustomEvent("audioNavigationCommand", {
                  detail: { command: "stopPractice" },
                })
              );
              return;
            }
      
            if (
              helpCommands[language].some((cmd) => normalizedCommand.includes(cmd))
            ) {
        if (helpRepetitionCounter.current >= 3) {
          const message = "You have already requested help multiple times. Please try a different command.";
          setAnnouncement(message);
          speakText(message, "high");
          helpRepetitionCounter.current = 0; // Reset after notifying user
          return;
        }
        const currentPath = window.location.pathname;
        let helpText = "";

        if (currentPath === "/dashboard") {
          helpText = t("helpDashboard", {
              english: "Available commands: Global - 'Go to Progress', 'Go to Settings', 'Go to Lessons'. Topics - 'Basic Math', 'Intermediate Math', 'Algebra'. Say 'Exit' to exit audio navigation mode.",
              hausa: "Umarnin da ake iya amfani da su: Gaba daya - 'Zuwa Progress', 'Zuwa Settings', 'Zuwa Darussa'. Batutuwa - 'Lissafin Asali', 'Lissafin Matsakaici', 'Algebra'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
              kanuri: "Umarni da ake iya amfani: Gaba daya - 'Progress zuwa', 'Settings zuwa', 'Darussa zuwa'. Batutuwa - 'Lissafin Asali', 'Lissafin Matsakaici', 'Algebra'. 'Fita' ce murya kewayawa yanayi daga fita don.",
              arabic: "الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'، 'الانتقال إلى الدروس'. قل 'مساعدة' للمزيد من الأوامر. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else if (currentPath.includes("/topics/")) {
          helpText = t("helpTopic", {
              english: "Available commands: Say lesson names to navigate to lessons, 'Go back' to return to dashboard. Global - 'Go to Progress', 'Go to Settings'. Say 'Exit' to exit audio navigation mode.",
              hausa: "Umarnin da ake iya amfani da su: Ka ce sunaye na darussa don zuwa darussa, 'Koma baya' don komawa dashboard. Gaba daya - 'Zuwa Progress', 'Zuwa Settings'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
              kanuri: "Umarni da ake iya amfani: Darussa sunaye ce darussa zuwa don, 'Baya koma' ce dashboard komawa don. Gaba daya - 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
              arabic: ""
          });
        } else if (currentPath.includes("/lesson/")) {
          helpText = t("helpLesson", {
              english: "Available commands: 'Start practice', 'Read question', 'Next question', 'Repeat question', 'Stop practice'. Global - 'Go to Dashboard', 'Go to Progress', 'Go to Settings'. Say 'Exit' to exit audio navigation mode.",
              hausa: "Umarnin da ake iya amfani da su: 'Fara aiki', 'Karanta tambaya', 'Tambaya ta gaba', 'Maimaita tambaya', 'Dakatar da aiki'. Gaba daya - 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
              kanuri: "Umarni da ake iya amfani: 'Fara aiki', 'Karanta tambaya', 'Tambaya ta gaba', 'Maimaita tambaya', 'Dakatar da aiki'. Gaba daya - 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
              arabic: ""
          });
        } else {
          helpText = t("helpGeneral", {
              english: "Global commands: 'Go to Dashboard', 'Go to Progress', 'Go to Settings', 'Go to Lessons'. Say 'Exit' for more commands. To exit audio navigation mode, say 'Exit'.",
              hausa: "Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings', 'Zuwa Darussa'. Ka ce 'Taimako' don karin umarni. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
              kanuri: "Gaba daya umarni: 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa', 'Darussa zuwa'. 'Taimako' ce karin umarni don. Murya kewayawa yanayi daga fita don, 'Fita' ce.",
              arabic: ""
          });
        }

        setAnnouncement(helpText);
        speakText(helpText, "high");
        helpRepetitionCounter.current += 1;
        return;
      }

      // Reset counter if any other command is issued
      helpRepetitionCounter.current = 0;

      // Fallback for unrecognized commands
      const message = t("commandNotFound", {
        english: "Command not recognized. Please say 'help' for a list of available commands or try again.",
        hausa: "Ba a gane umarnin ba. Da fatan za a ce 'taimako' don jerin umarni da ake da su ko a sake gwadawa.",
        kanuri: "Umarni ba a gane ba. 'Taimako' ce don umarni da ake da su ko sake gwadawa.",
        arabic: "لم يتم التعرف على الأمر. يرجى قول 'مساعدة' للحصول على قائمة بالأوامر المتاحة أو المحاولة مرة أخرى."
      });
      setAnnouncement(message);
      speakText(message, "high");
    },
    [
      router,
      speakText,
      t,
      language,
      toggleAudioNavigationMode,
      setSpeechQueue,
      stopListening,
      announcement,
    ]
  );

  const startListening = useCallback(async () => {
    if (
      !mountedRef.current ||
      !isAudioNavigationModeRef.current ||
      isListening
    ) {
      return;
    }

    console.log("🎤 [Vosk] Initializing speech recognition...");
    setIsListening(true);

    try {
      let currentModel = model;
      if (!currentModel) {
        speakText("Loading recognition model...", "high");
        console.log(`[Vosk] Creating model from: ${VOSK_MODEL_URL}`);
        currentModel = await createModel(VOSK_MODEL_URL);
        setModel(currentModel);
        speakText("Model loaded. Ready for commands.", "medium");
      }

      const recognizer = new currentModel.KaldiRecognizer(16000);
      recognizer.on("result", (message: any) => {
        const text = message.result.text;
        if (text) {
          handleVoiceCommand(text);
        }
      });
      recognizerRef.current = recognizer;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(1024, 1, 1);

      processor.onaudioprocess = (event) => {
        if (!isAudioNavigationModeRef.current || isSpeakingRef.current) return;
        try {
          recognizer.acceptWaveform(event.inputBuffer);
        } catch (error) {
          console.error("[Vosk] Error accepting waveform:", error);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("💥 [Vosk] Setup error:", error);
      speakText(
        "Voice recognition failed to start. Please check microphone permissions and model URL.",
        "high"
      );
      setIsListening(false);
      stopListening();
    }
  }, [isListening, model, handleVoiceCommand, speakText, stopListening]);

  useEffect(() => {
    if (isAudioNavigationMode && mounted) {
      startListening();
    } else {
      stopListening();
    }
    return () => stopListening();
  }, [isAudioNavigationMode, mounted]);

  useEffect(() => {
    return () => {
      stopListening();
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    };
  }, [stopListening]);

  return (
    <VoskAudioNavigationContext.Provider
      value={{
        isAudioNavigationMode,
        isListening,
        currentFocus,
        availableCommands,
        showDeactivationMessage,
        announcement,
        toggleAudioNavigationMode,
        startListening,
        stopListening,
        speakText,
        announceCurrentFocus,
        setCurrentFocus,
        setAnnouncement,
        announcePage,
      }}
    >
      {children}
    </VoskAudioNavigationContext.Provider>
  );
}

export function useAudioNavigation() {
  const context = useContext(VoskAudioNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useAudioNavigation must be used within a VoskAudioNavigationProvider"
    );
  }
  return context;
}
