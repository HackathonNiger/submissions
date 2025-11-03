'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from './auth';
import { useLanguage } from './language-context';
import { createNigerianUtterance, selectNigerianVoice } from './voice-utils';
import { lessons } from './lessons-data';

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
  speakText: (text: string, priority?: 'low' | 'medium' | 'high') => void;
  announceCurrentFocus: () => void;
  setCurrentFocus: (focus: string | null) => void;
  setAnnouncement: (text: string) => void; // For ARIA live region
}

const AudioNavigationContext = createContext<AudioNavigationContextType | undefined>(undefined);

export function AudioNavigationProvider({ children }: { children: React.ReactNode }) {
  const [isAudioNavigationMode, setIsAudioNavigationMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [speechQueue, setSpeechQueue] = useState<Array<{ text: string; priority: 'low' | 'medium' | 'high' }>>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDeactivationMessage, setShowDeactivationMessage] = useState(false);
  const [announcement, setAnnouncement] = useState(''); // For ARIA live region

  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAudioNavigationModeRef = useRef(isAudioNavigationMode);
  const mountedRef = useRef(mounted);
  const criticalErrorRef = useRef(false); // Flag to prevent restart loops

  const router = useRouter();
  const { language, t } = useLanguage();

  useEffect(() => {
    isAudioNavigationModeRef.current = isAudioNavigationMode;
  }, [isAudioNavigationMode]);

  useEffect(() => {
    mountedRef.current = mounted;
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableCommands = [
    'basic math',
    'intermediate math',
    'algebra',
    'start practice',
    'read question',
    'next question',
    'repeat question',
    'stop practice',
    'exit',
    'help',
  ];

  const speakText = useCallback(
    (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
      if (!text) return;

      // Update ARIA live region
      setAnnouncement(text);

      setSpeechQueue((prev) => {
        const newItem = { text, priority };
        if (priority === 'high') {
          return [newItem, ...prev];
        }
        if (priority === 'low') {
          return [...prev, newItem];
        }
        const highPriorityItems = prev.filter((item) => item.priority === 'high');
        const nonHighPriorityItems = prev.filter((item) => item.priority !== 'high');
        return [...highPriorityItems, newItem, ...nonHighPriorityItems];
      });
    },
    []
  );

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking && 'speechSynthesis' in window) {
      const nextItem = speechQueue[0];
      setSpeechQueue((prev) => prev.slice(1));
      setIsSpeaking(true);

      const user = getUser();
      const userSettings =
        user?.settings
          ? { audioSpeed: user.settings.audioSpeed, audioPitch: user.settings.audioPitch }
          : undefined;
      const utterance =
        language !== 'english'
          ? createNigerianUtterance(nextItem.text, language, userSettings)
          : new SpeechSynthesisUtterance(nextItem.text);

      if (language === 'english') {
        utterance.lang = 'en-US';
        const audioSpeed = userSettings?.audioSpeed ?? 'normal';
        utterance.rate = audioSpeed === 'slow' ? 0.7 : audioSpeed === 'very-slow' ? 0.5 : 0.9;
        utterance.pitch = userSettings?.audioPitch === 'high' ? 1.2 : 1;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  }, [speechQueue, isSpeaking, language]);

  const toggleAudioNavigationMode = useCallback(() => {
    const newMode = !isAudioNavigationMode;
    setIsAudioNavigationMode(newMode);

    const user = getUser();
    if (user) {
      updateUser({
        settings: {
          ...user.settings,
          audioNavigation: newMode,
        },
      });
    }

    if (newMode) {
      setTimeout(() => {
        const currentPath = window.location.pathname;
        let welcomeMessage = '';

        if (currentPath === '/dashboard') {
          welcomeMessage = t('dashboardWelcome', {
            english:
              "Audio navigation activated. Welcome to your dashboard. Global commands: Say 'Go to Progress', 'Go to Settings', or 'Go to Lessons'. Topic commands: Say 'Basic Math', 'Intermediate Math', or 'Algebra'. Say 'Help' to repeat these commands. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Barka da zuwa dashboard naka. Umarnin gaba daya: Ka ce 'Zuwa Progress', 'Zuwa Settings', ko 'Zuwa Darussa'. Umarnin batu: Ka ce 'Lissafin Asali', 'Lissafin Matsakaici', ko 'Algebra'. Ka ce 'Taimako' don maimaita wadannan umarni. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Dashboard naka zuwa barka. Gaba daya umarni: 'Progress zuwa', 'Settings zuwa', ko 'Darussa zuwa' ce. Batu umarni: 'Lissafin Asali', 'Lissafin Matsakaici', ko 'Algebra' ce. 'Taimako' ce wadannan umarni maimaita don. Murya kewayawa yanayi daga fita don, 'Fita' ce.",
            arabic:
              "تم تفعيل التنقل الصوتي. مرحبا بك في لوحة القيادة. الأوامر العامة: قل 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'، أو 'الانتقال إلى الدروس'. أوامر المواضيع: قل 'الرياضيات الأساسية'، 'الرياضيات المتوسطة'، أو 'الجبر'. قل 'مساعدة' لتكرار هذه الأوامر. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else if (currentPath.includes('/topics/')) {
          welcomeMessage = t('topicWelcome', {
            english:
              "Audio navigation activated. You're now in a topic page. Say the lesson name to go to that lesson, or say 'Go back' to return to dashboard. Global commands: 'Go to Progress', 'Go to Settings'. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Yanzu kana cikin shafin batu. Ka ce sunan darasi don zuwa wannan darasi, ko ka ce 'Koma baya' don komawa dashboard. Umarnin gaba daya: 'Zuwa Progress', 'Zuwa Settings'. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Batu shafi cikin yanzu. Darasi suna ce wannan darasi zuwa don, ko 'Baya koma' ce dashboard komawa don. Gaba daya umarni: 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "تم تفعيل التنقل الصوتي. أنت الآن في صفحة موضوع. قل اسم الدرس للانتقال إلى ذلك الدرس، أو قل 'العودة' للعودة إلى لوحة القيادة. الأوامر العامة: 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else if (currentPath.includes('/lesson/')) {
          welcomeMessage = t('lessonWelcome', {
            english:
              "Audio navigation activated. You're now in a lesson. Say 'Start practice' to begin, 'Read question' to hear the current question, 'Next question' to continue, or 'Stop practice' to end. Global commands: 'Go to Dashboard', 'Go to Progress', 'Go to Settings'. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Yanzu kana cikin darasi. Ka ce 'Fara aiki' don farawa, 'Karanta tambaya' don jin tambayar yanzu, 'Tambaya ta gaba' don ci gaba, ko 'Dakatar da aiki' don karewa. Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings'. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Darasi cikin yanzu. 'Fara aiki' ce farawa don, 'Karanta tambaya' ce tambayar yanzu ji don, 'Tambaya ta gaba' ce ci gaba don, ko 'Dakatar da aiki' ce karewa don. Gaba daya umarni: 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "تم تفعيل التنقل الصوتي. أنت الآن في درس. قل 'ابدأ التمرين' للبدء، 'اقرأ السؤال' لسماع السؤال الحالي، 'السؤال التالي' للمتابعة، أو 'توقف عن التمرين' للإنهاء. الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else if (currentPath === '/progress') {
          welcomeMessage = t('progressWelcome', {
            english:
              "Audio navigation activated. You're viewing your progress. Global commands: 'Go to Dashboard', 'Go to Settings', 'Go to Lessons'. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Kana kallon ci gaban ka. Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Settings', 'Zuwa Darussa'. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Ci gaban ka kallo. Gaba daya umarni: 'Dashboard zuwa', 'Settings zuwa', 'Darussa zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "تم تفعيل التنقل الصوتي. أنت تشاهد تقدمك. الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى الإعدادات'، 'الانتقال إلى الدروس'. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else if (currentPath === '/settings') {
          welcomeMessage = t('settingsWelcome', {
            english:
              "Audio navigation activated. You're in settings. Say 'Toggle audio navigation', 'Toggle dyslexia font', 'Toggle subtitles', 'Change language', 'Change audio speed', or 'Change audio pitch'. Global commands: 'Go to Dashboard', 'Go to Progress', 'Go to Lessons'. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Kana cikin saitunan. Ka ce 'Kunna kewayawa da murya', 'Kunna rubutun dyslexia', 'Kunna rubutu', 'Canza harshe', 'Canza saurin sauti', ko 'Canza sautin sauti'. Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Darussa'. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Saitunan cikin. 'Kunna murya kewayawa', 'Kunna rubutun dyslexia', 'Kunna rubutu', 'Canza harshe', 'Canza saurin sauti', ko 'Canza sautin sauti' ce. Gaba daya umarni: 'Dashboard zuwa', 'Progress zuwa', 'Darussa zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "تم تفعيل التنقل الصوتي. أنت في الإعدادات. قل 'تبديل التنقل الصوتي'، 'تبديل خط الديسلكسيا'، 'تبديل النصوص التوضيحية'، 'تغيير اللغة'، 'تغيير سرعة الصوت'، أو 'تغيير نبرة الصوت'. الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الدروس'. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        } else {
          welcomeMessage = t('generalWelcome', {
            english:
              "Audio navigation activated. Global commands: 'Go to Dashboard', 'Go to Progress', 'Go to Settings', 'Go to Lessons'. Say 'Help' for more commands. To exit audio navigation mode, say 'Exit'.",
            hausa:
              "An kunna kewayawa da murya. Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings', 'Zuwa Darussa'. Ka ce 'Taimako' don karin umarni. Don fita daga yanayin kewayawa da murya, ka ce 'Fita'.",
            kanuri:
              "Murya kewayawa kunna. Gaba daya umarni: 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa', 'Darussa zuwa'. 'Taimako' ce karin umarni don. Murya kewayawa yanayi daga fita don, 'Fita' ce.",
            arabic:
              "تم تفعيل التنقل الصوتي. الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'، 'الانتقال إلى الدروس'. قل 'مساعدة' للمزيد من الأوامر. للخروج من وضع التنقل الصوتي، قل 'خروج'.",
          });
        }

        speakText(welcomeMessage, 'high');
      }, 500); // Reduced delay for faster feedback
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
        recognitionRef.current = null;
      }

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      setIsListening(false);

      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setSpeechQueue([]);
      setIsSpeaking(false);
      setShowDeactivationMessage(true);
      setTimeout(() => {
        setShowDeactivationMessage(false);
        setAnnouncement(
          t('audioNavDeactivated', {
            english: 'Audio navigation mode deactivated.',
            hausa: 'An kashe yanayin kewayawa da murya.',
            kanuri: 'Murya kewayawa yanayi kashe.',
            arabic: 'تم إلغاء تفعيل وضع التنقل الصوتي.',
          })
        );
        speakText(announcement, 'high');
      }, 100);
    }
  }, [isAudioNavigationMode, speakText, t]);

  const handleVoiceCommand = useCallback(
    (command: string) => {
      console.log('🗣️ Processing command:', command);
      const normalizedCommand = command.toLowerCase().trim();

      // Global navigation commands
      if (
        normalizedCommand.includes('go to dashboard') ||
        normalizedCommand.includes('zuwa dashboard') ||
        normalizedCommand.includes('dashboard zuwa') ||
        normalizedCommand.includes('لوحة القيادة')
      ) {
        const message = t('goingToDashboard', {
          english: 'Going to Dashboard',
          hausa: 'Zuwa Dashboard',
          kanuri: 'Dashboard zuwa',
          arabic: 'الانتقال إلى لوحة القيادة',
        });
        setSpeechQueue([]); // Clear queue
        setAnnouncement(message);
        speakText(message, 'medium');
        router.push('/dashboard');
        return;
      }

      if (
        normalizedCommand.includes('go to progress') ||
        normalizedCommand.includes('zuwa progress') ||
        normalizedCommand.includes('progress zuwa') ||
        normalizedCommand.includes('التقدم')
      ) {
        const message = t('goingToProgress', {
          english: 'Going to Progress',
          hausa: 'Zuwa Ci gaba',
          kanuri: 'Ci gaba zuwa',
          arabic: 'الانتقال إلى التقدم',
        });
        setAnnouncement(message);
        speakText(message, 'medium');
        router.push('/progress');
        return;
      }

      if (
        normalizedCommand.includes('go to settings') ||
        normalizedCommand.includes('zuwa settings') ||
        normalizedCommand.includes('settings zuwa') ||
        normalizedCommand.includes('الإعدادات')
      ) {
        const message = t('goingToSettings', {
          english: 'Going to Settings',
          hausa: 'Zuwa Saitunan',
          kanuri: 'Saitunan zuwa',
          arabic: 'الانتقال إلى الإعدادات',
        });
        setAnnouncement(message);
        speakText(message, 'medium');
        router.push('/settings');
        return;
      }

      if (
        normalizedCommand.includes('go to lessons') ||
        normalizedCommand.includes('zuwa darussa') ||
        normalizedCommand.includes('darussa zuwa') ||
        normalizedCommand.includes('الدروس')
      ) {
        const message = t('goingToLessons', {
          english: 'Going to Lessons',
          hausa: 'Zuwa Darussa',
          kanuri: 'Darussa zuwa',
          arabic: 'الانتقال إلى الدروس',
        });
        setAnnouncement(message);
        speakText(message, 'medium');
        router.push('/topics/basic');
        return;
      }

      if (
        normalizedCommand.includes('go back') ||
        normalizedCommand.includes('koma baya') ||
        normalizedCommand.includes('baya koma') ||
        normalizedCommand.includes('رجوع')
      ) {
        const message = t('goingBack', {
          english: 'Going back',
          hausa: 'Koma baya',
          kanuri: 'Baya koma',
          arabic: 'العودة',
        });
        setAnnouncement(message);
        speakText(message, 'medium');
        router.back();
        return;
      }

      if (
        normalizedCommand.includes('exit') ||
        normalizedCommand.includes('fita') ||
        normalizedCommand.includes('dakatar') ||
        normalizedCommand.includes('خروج')
      ) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.log('Error stopping recognition:', e);
          }
          recognitionRef.current = null;
        }

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }

        setIsListening(false);

        if ('speechSynthesis' in window) {
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
          const message = t('audioNavDeactivated', {
            english: 'Audio navigation mode deactivated.',
            hausa: 'An kashe yanayin kewayawa da murya.',
            kanuri: 'Murya kewayawa yanayi kashe.',
            arabic: 'تم إلغاء تفعيل وضع التنقل الصوتي.',
          });
          setAnnouncement(message);
          speakText(message, 'high');
        }, 100);
        return;
      }

      // Settings-specific commands
      if (window.location.pathname === '/settings') {
        if (
          normalizedCommand.includes('toggle audio navigation') ||
          normalizedCommand.includes('kunna kewayawa da murya') ||
          normalizedCommand.includes('تبديل التنقل الصوتي')
        ) {
          toggleAudioNavigationMode();
          return;
        }
        if (
          normalizedCommand.includes('toggle dyslexia font') ||
          normalizedCommand.includes('kunna rubutun dyslexia') ||
          normalizedCommand.includes('تبديل خط الديسلكسيا')
        ) {
          const user = getUser();
          if (user) {
            updateUser({
              settings: {
                ...user.settings,
                dyslexiaFont: !user.settings.dyslexiaFont,
              },
            });
            const message = t(user.settings.dyslexiaFont ? 'dyslexiaFontDisabled' : 'dyslexiaFontEnabled', {
              english: user.settings.dyslexiaFont ? 'Dyslexia font disabled' : 'Dyslexia font enabled',
              hausa: user.settings.dyslexiaFont ? 'Rubutun dyslexia kashe' : 'Rubutun dyslexia kunna',
              kanuri: user.settings.dyslexiaFont ? 'Rubutun dyslexia kashe' : 'Rubutun dyslexia kunna',
              arabic: user.settings.dyslexiaFont ? 'تم تعطيل خط الديسلكسيا' : 'تم تفعيل خط الديسلكسيا',
            });
            setAnnouncement(message);
            speakText(message, 'medium');
          }
          return;
        }
        if (
          normalizedCommand.includes('toggle subtitles') ||
          normalizedCommand.includes('kunna rubutu') ||
          normalizedCommand.includes('تبديل النصوص التوضيحية')
        ) {
          const user = getUser();
          if (user) {
            updateUser({
              settings: {
                ...user.settings,
                subtitles: !user.settings.subtitles,
              },
            });
            const message = t(user.settings.subtitles ? 'subtitlesDisabled' : 'subtitlesEnabled', {
              english: user.settings.subtitles ? 'Subtitles disabled' : 'Subtitles enabled',
              hausa: user.settings.subtitles ? 'Rubutu kashe' : 'Rubutu kunna',
              kanuri: user.settings.subtitles ? 'Rubutu kashe' : 'Rubutu kunna',
              arabic: user.settings.subtitles ? 'تم تعطيل النصوص التوضيحية' : 'تم تفعيل النصوص التوضيحية',
            });
            setAnnouncement(message);
            speakText(message, 'medium');
          }
          return;
        }
        if (
          normalizedCommand.includes('change language') ||
          normalizedCommand.includes('canza harshe') ||
          normalizedCommand.includes('تغيير اللغة')
        ) {
          const message = t('languageSelectorOpened', {
            english: 'Language selector opened',
            hausa: 'Zabin harshe ya buɗe',
            kanuri: 'Zabin harshe ya buɗe',
            arabic: 'تم فتح محدد اللغة',
          });
          setAnnouncement(message);
          speakText(message, 'medium');
          window.dispatchEvent(
            new CustomEvent('audioNavigationCommand', { detail: { command: 'changeLanguage' } })
          );
          return;
        }
        if (
          normalizedCommand.includes('change audio speed') ||
          normalizedCommand.includes('canza saurin sauti') ||
          normalizedCommand.includes('تغيير سرعة الصوت')
        ) {
          const user = getUser();
          if (user) {
            const speeds = ['normal', 'slow', 'very-slow'] as const;
            const currentIndex = speeds.indexOf(user.settings.audioSpeed);
            const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
            updateUser({
              settings: {
                ...user.settings,
                audioSpeed: nextSpeed,
              },
            });
            const message = t('audioSpeedChanged', {
              english: `Audio speed changed to ${nextSpeed}`,
              hausa: `Saurin sauti ya canza zuwa ${nextSpeed}`,
              kanuri: `Saurin sauti ya canza zuwa ${nextSpeed}`,
              arabic: `تم تغيير سرعة الصوت إلى ${nextSpeed}`,
            });
            setAnnouncement(message);
            speakText(message, 'medium');
          }
          return;
        }
        if (
          normalizedCommand.includes('change audio pitch') ||
          normalizedCommand.includes('canza sautin sauti') ||
          normalizedCommand.includes('تغيير نبرة الصوت')
        ) {
          const user = getUser();
          if (user) {
            const pitches = ['normal', 'high'] as const;
            const currentIndex = pitches.indexOf(user.settings.audioPitch);
            const nextPitch = pitches[(currentIndex + 1) % pitches.length];
            updateUser({
              settings: {
                ...user.settings,
                audioPitch: nextPitch,
              },
            });
            const message = t('audioPitchChanged', {
              english: `Audio pitch changed to ${nextPitch}`,
              hausa: `Sautin sauti ya canza zuwa ${nextPitch}`,
              kanuri: `Sautin sauti ya canza zuwa ${nextPitch}`,
              arabic: `تم تغيير نبرة الصوت إلى ${nextPitch}`,
            });
            setAnnouncement(message);
            speakText(message, 'medium');
          }
          return;
        }
      }

      // Lesson-specific commands
      if (window.location.pathname.includes('/lesson/')) {
        const lessonId = window.location.pathname.split('/').pop();
        const currentLesson = lessons.find((l: any) => l.id === lessonId);

        if (
          normalizedCommand.includes('start practice') ||
          normalizedCommand.includes('fara aiki') ||
          normalizedCommand.includes('ابدأ التمرين')
        ) {
          window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'startPractice' } }));
          return;
        }

        if (
          normalizedCommand.includes('read question') ||
          normalizedCommand.includes('repeat question') ||
          normalizedCommand.includes('karanta tambaya') ||
          normalizedCommand.includes('maimaita tambaya') ||
          normalizedCommand.includes('اقرأ السؤال') ||
          normalizedCommand.includes('كرر السؤال')
        ) {
          window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'readQuestion' } }));
          return;
        }

        if (
          normalizedCommand.includes('next question') ||
          normalizedCommand.includes('tambaya ta gaba') ||
          normalizedCommand.includes('السؤال التالي')
        ) {
          window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'nextQuestion' } }));
          return;
        }

        if (
          normalizedCommand.includes('stop practice') ||
          normalizedCommand.includes('dakatar da aiki') ||
          normalizedCommand.includes('توقف عن التمرين')
        ) {
          window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'stopPractice' } }));
          return;
        }

        // Handle answer selection
        if (currentLesson) {
          // Try to get current question index from the lesson page state
          // Since we can't access the component state directly, we'll use a more generic approach
          const currentQuestionIndex = 0; // This will be handled by the lesson component
          const allOptions = currentLesson.questions.flatMap((q: any) => q.options || []);
          
          const matchedOption = allOptions.find(
            (option: any) =>
              option.toLowerCase().includes(normalizedCommand) ||
              normalizedCommand.includes(option.toLowerCase())
          );

          if (matchedOption) {
            window.dispatchEvent(
              new CustomEvent('audioNavigationCommand', { detail: { command: 'genericCommand', text: matchedOption } })
            );
            return;
          }

          const numberMatch = normalizedCommand.match(/\d+/);
          if (numberMatch) {
            const number = parseInt(numberMatch[0]);
            const numberOption = allOptions.find((option: any) => option.includes(number.toString()));
            if (numberOption) {
              window.dispatchEvent(
                new CustomEvent('audioNavigationCommand', { detail: { command: 'genericCommand', text: numberOption } })
              );
              return;
            }
          }
        }
      }

      // Topic-specific commands
      const basicMathCommands = {
        english: ['basic math', 'basic mathematics'],
        hausa: ['lissafin farko', 'lissafi na asali'],
        kanuri: ['lissafin farko', 'lissafi asali'],
        arabic: ['الرياضيات الأساسية', 'الأساسية'],
      };

      const intermediateMathCommands = {
        english: ['intermediate math', 'intermediate mathematics'],
        hausa: ['lissafin matsakaici', 'lissafi na matsakaici'],
        kanuri: ['lissafin matsakaici', 'lissafi matsakaici'],
        arabic: ['الرياضيات المتوسطة', 'المتوسطة'],
      };

      const algebraCommands = {
        english: ['algebra'],
        hausa: ['algebra'],
        kanuri: ['algebra'],
        arabic: ['الجبر'],
      };

      const startPracticeCommands = {
        english: ['start practice', 'begin practice', 'start'],
        hausa: ['fara aiki', 'fara horawa'],
        kanuri: ['fara aiki', 'fara horawa'],
        arabic: ['ابدأ التمرين', 'ابدأ'],
      };

      const readQuestionCommands = {
        english: ['read question', 'repeat question', 'hear question'],
        hausa: ['karanta tambaya', 'maimaita tambaya'],
        kanuri: ['karanta tambaya', 'maimaita tambaya'],
        arabic: ['اقرأ السؤال', 'كرر السؤال'],
      };

      const nextQuestionCommands = {
        english: ['next question', 'next'],
        hausa: ['tambaya ta gaba', 'na gaba'],
        kanuri: ['tambaya ta gaba', 'na gaba'],
        arabic: ['السؤال التالي', 'التالي'],
      };

      const stopPracticeCommands = {
        english: ['stop practice', 'stop', 'end practice'],
        hausa: ['dakatar da aiki', 'ƙare aiki'],
        kanuri: ['dakatar da aiki', 'ƙare aiki'],
        arabic: ['توقف عن التمرين', 'إنهاء'],
      };

      const helpCommands = {
        english: ['help', 'commands', 'what can i say'],
        hausa: ['taimako', 'umarni', 'me za na iya yi'],
        kanuri: ['taimako', 'umarni', 'me za na iya yi'],
        arabic: ['مساعدة', 'أوامر', 'ماذا يمكنني أن أقول'],
      };

      if (basicMathCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('goingToBasic', {
            english: 'Going to Basic Math',
            hausa: 'Zuwa Lissafin Asali',
            kanuri: 'Lissafin Asali zuwa',
            arabic: 'الانتقال إلى الرياضيات الأساسية',
          })
        );
        speakText(announcement, 'medium');
        router.push('/topics/basic');
        return;
      }

      if (intermediateMathCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('goingToIntermediate', {
            english: 'Going to Intermediate Math',
            hausa: 'Zuwa Lissafin Matsakaici',
            kanuri: 'Lissafin Matsakaici zuwa',
            arabic: 'الانتقال إلى الرياضيات المتوسطة',
          })
        );
        speakText(announcement, 'medium');
        router.push('/topics/intermediate');
        return;
      }

      if (algebraCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('goingToAlgebra', {
            english: 'Going to Algebra',
            hausa: 'Zuwa Algebra',
            kanuri: 'Algebra zuwa',
            arabic: 'الانتقال إلى الجبر',
          })
        );
        speakText(announcement, 'medium');
        router.push('/topics/algebra');
        return;
      }

      if (startPracticeCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('startingPractice', {
            english: 'Starting practice',
            hausa: 'Fara aiki',
            kanuri: 'Fara aiki',
            arabic: 'بدء التمرين',
          })
        );
        speakText(announcement, 'medium');
        window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'startPractice' } }));
        return;
      }

      if (readQuestionCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('readingQuestion', {
            english: 'Reading question',
            hausa: 'Karanta tambaya',
            kanuri: 'Karanta tambaya',
            arabic: 'قراءة السؤال',
          })
        );
        speakText(announcement, 'medium');
        window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'readQuestion' } }));
        return;
      }

      if (nextQuestionCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('nextQuestion', {
            english: 'Moving to next question',
            hausa: 'Tambaya ta gaba',
            kanuri: 'Tambaya ta gaba',
            arabic: 'الانتقال إلى السؤال التالي',
          })
        );
        speakText(announcement, 'medium');
        window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'nextQuestion' } }));
        return;
      }

      if (stopPracticeCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        setAnnouncement(
          t('stoppingPractice', {
            english: 'Stopping practice',
            hausa: 'Dakatar da aiki',
            kanuri: 'Dakatar da aiki',
            arabic: 'إيقاف التمرين',
          })
        );
        speakText(announcement, 'medium');
        window.dispatchEvent(new CustomEvent('audioNavigationCommand', { detail: { command: 'stopPractice' } }));
        return;
      }

      if (helpCommands[language].some((cmd) => normalizedCommand.includes(cmd))) {
        const currentPath = window.location.pathname;
        let helpText = '';

        if (currentPath === '/dashboard') {
          helpText = t('helpDashboard', {
            english:
              "Available commands: Global - 'Go to Progress', 'Go to Settings', 'Go to Lessons'. Topics - 'Basic Math', 'Intermediate Math', 'Algebra'. Say 'Exit' to exit audio navigation mode.",
            hausa:
              "Umarnin da ake iya amfani da su: Gaba daya - 'Zuwa Progress', 'Zuwa Settings', 'Zuwa Darussa'. Batutuwa - 'Lissafin Asali', 'Lissafin Matsakaici', 'Algebra'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
            kanuri:
              "Umarni da ake iya amfani: Gaba daya - 'Progress zuwa', 'Settings zuwa', 'Darussa zuwa'. Batutuwa - 'Lissafin Asali', 'Lissafin Matsakaici', 'Algebra'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "الأوامر المتاحة: عامة - 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'، 'الانتقال إلى الدروس'. المواضيع - 'الرياضيات الأساسية'، 'الرياضيات المتوسطة'، 'الجبر'. قل 'خروج' للخروج من وضع التنقل الصوتي.",
          });
        } else if (currentPath.includes('/topics/')) {
          helpText = t('helpTopic', {
            english:
              "Available commands: Say lesson names to navigate to lessons, 'Go back' to return to dashboard. Global - 'Go to Progress', 'Go to Settings'. Say 'Exit' to exit audio navigation mode.",
            hausa:
              "Umarnin da ake iya amfani da su: Ka ce sunaye na darussa don zuwa darussa, 'Koma baya' don komawa dashboard. Gaba daya - 'Zuwa Progress', 'Zuwa Settings'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
            kanuri:
              "Umarni da ake iya amfani: Darussa sunaye ce darussa zuwa don, 'Baya koma' ce dashboard komawa don. Gaba daya - 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "الأوامر المتاحة: قل أسماء الدروس للانتقال إلى الدروس، 'العودة' للعودة إلى لوحة القيادة. عامة - 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'. قل 'خروج' للخروج من وضع التنقل الصوتي.",
          });
        } else if (currentPath.includes('/lesson/')) {
          helpText = t('helpLesson', {
            english:
              "Available commands: 'Start practice', 'Read question', 'Next question', 'Repeat question', 'Stop practice'. Global - 'Go to Dashboard', 'Go to Progress', 'Go to Settings'. Say 'Exit' to exit audio navigation mode.",
            hausa:
              "Umarnin da ake iya amfani da su: 'Fara aiki', 'Karanta tambaya', 'Tambaya ta gaba', 'Maimaita tambaya', 'Dakatar da aiki'. Gaba daya - 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
            kanuri:
              "Umarni da ake iya amfani: 'Fara aiki', 'Karanta tambaya', 'Tambaya ta gaba', 'Maimaita tambaya', 'Dakatar da aiki'. Gaba daya - 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "الأوامر المتاحة: 'ابدأ التمرين'، 'اقرأ السؤال'، 'السؤال التالي'، 'كرر السؤال'، 'توقف عن التمرين'. عامة - 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'. قل 'خروج' للخروج من وضع التنقل الصوتي.",
          });
        } else {
          helpText = t('helpGeneral', {
            english:
              "Global commands: 'Go to Dashboard', 'Go to Progress', 'Go to Settings', 'Go to Lessons'. Say 'Exit' to exit audio navigation mode.",
            hausa:
              "Umarnin gaba daya: 'Zuwa Dashboard', 'Zuwa Progress', 'Zuwa Settings', 'Zuwa Darussa'. Ka ce 'Fita' don fita daga yanayin kewayawa da murya.",
            kanuri:
              "Gaba daya umarni: 'Dashboard zuwa', 'Progress zuwa', 'Settings zuwa', 'Darussa zuwa'. 'Fita' ce murya kewayawa yanayi daga fita don.",
            arabic:
              "الأوامر العامة: 'الانتقال إلى لوحة القيادة'، 'الانتقال إلى التقدم'، 'الانتقال إلى الإعدادات'، 'الانتقال إلى الدروس'. قل 'خروج' للخروج من وضع التنقل الصوتي.",
          });
        }

        setAnnouncement(helpText);
        speakText(helpText, 'high');
        return;
      }

      // Generic command handling
      setAnnouncement(
        t('processingCommand', {
          english: `Processing command: ${normalizedCommand}`,
          hausa: `Ana sarrafa umarni: ${normalizedCommand}`,
          kanuri: `Umarni sarrafa: ${normalizedCommand}`,
          arabic: `جارٍ معالجة الأمر: ${normalizedCommand}`,
        })
      );
      speakText(announcement, 'medium');
      window.dispatchEvent(
        new CustomEvent('audioNavigationCommand', { detail: { command: 'genericCommand', text: normalizedCommand } })
      );
    },
    [router, speakText, t, language, toggleAudioNavigationMode, setSpeechQueue]
  );

  const startListening = useCallback(async () => {
    if (!mountedRef.current || !isAudioNavigationModeRef.current || isListening) {
      return;
    }

    console.log('🎤 Initializing speech recognition...');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('❌ Speech recognition not supported');
      setAnnouncement(
        t('speechNotSupported', {
          english: 'Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
          hausa: 'Ba a tallafa wa amfani da murya a wannan mai bincike ba. Da fatan za a yi amfani da Chrome, Edge, ko Safari.',
          kanuri: 'Murya amfani ba a tallafa cikin wannan mai bincike. Chrome, Edge, ko Safari amfani.',
          arabic: 'التعرف على الصوت غير مدعوم في هذا المتصفح. الرجاء استخدام Chrome أو Edge أو Safari.',
        })
      );
      speakText(announcement, 'high');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.log('Error stopping existing recognition:', e);
      }
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          stream.getTracks().forEach((track) => track.stop());
        } catch (permissionError: any) {
          console.error('❌ Microphone permission error:', permissionError);
          setAnnouncement(
            t('micPermissionError', {
              english: 'Microphone access is required. Please allow microphone access and try again.',
              hausa: 'Ana buƙatar samun damar microphone. Da fatan za a ba da izinin microphone kuma a sake gwadawa.',
              kanuri: 'Microphone samun dama bukata. Microphone izini ba kuma sake gwada.',
              arabic: 'مطلوب الوصول إلى الميكروفون. الرجاء السماح بالوصول إلى الميكروفون وحاول مرة أخرى.',
            })
          );
          speakText(announcement, 'high');
          return;
        }
      }

      const newRecognition = new SpeechRecognition();
      switch (language) {
        case 'hausa':
          newRecognition.lang = 'ha-NG';
          break;
        case 'kanuri':
          newRecognition.lang = 'en-NG'; // Use Nigerian English for Kanuri
          break;
        case 'arabic':
          newRecognition.lang = 'ar-SA';
          break;
        default:
          newRecognition.lang = 'en-US';
      }

      newRecognition.continuous = true;
      newRecognition.interimResults = false;
      newRecognition.maxAlternatives = 1;

      recognitionRef.current = newRecognition;

      newRecognition.onstart = () => {
        console.log('🎙️ Speech recognition started');
        setIsListening(true);
        criticalErrorRef.current = false; // Reset critical error flag on successful start
        setAnnouncement(
          t('listeningStarted', {
            english: 'Listening for voice commands...',
            hausa: 'Ina sauraren umarnin murya...',
            kanuri: 'Murya umarni sauraren...',
            arabic: 'الاستماع للأوامر الصوتية...',
          })
        );
        speakText(announcement, 'medium');
      };

      newRecognition.onresult = (event: any) => {
        try {
          if (event.results && event.results.length > 0) {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal && lastResult[0]) {
              const transcript = lastResult[0].transcript.toLowerCase().trim();
              console.log('🗣️ Voice command:', transcript);
              if (transcript.length > 0) {
                handleVoiceCommand(transcript);
              }
            }
          }
        } catch (error) {
          console.error('❌ Error processing result:', error);
        }
      };

      newRecognition.onerror = (event: any) => {
        console.error('❌ Recognition error:', event.error, event);
        setIsListening(false);

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }

        switch (event.error) {
          case 'no-speech':
            break;
          case 'audio-capture':
          case 'not-allowed':
          case 'service-not-allowed':
            criticalErrorRef.current = true; // Set critical error flag
            setAnnouncement(
              t('micError', {
                english: 'Microphone error. Please check permissions.',
                hausa: 'Kuskuren microphone. Da fatan za a duba izini.',
                kanuri: 'Microphone kuskure. Izini duba.',
                arabic: 'خطأ في الميكروفون. الرجاء التحقق من الأذونات.',
              })
            );
            speakText(announcement, 'high');
            return;
          case 'network':
            criticalErrorRef.current = true; // Set critical error flag
            setAnnouncement(
              t('networkError', {
                english: 'Network error. Please check your connection.',
                hausa: 'Kuskuren hanyar sadarwa. Da fatan za a duba haɗin ka.',
                kanuri: 'Hanyar sadarwa kuskure. Haɗin ka duba.',
                arabic: 'خطأ في الشبكة. الرجاء التحقق من اتصالك.',
              })
            );
            speakText(announcement, 'high');
            return;
          case 'aborted':
            return;
          default:
            console.warn('Unhandled recognition error:', event.error);
        }

        if (isAudioNavigationModeRef.current && mountedRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isAudioNavigationModeRef.current && mountedRef.current) {
              startListening();
            }
          }, 5000); // talking to fast does not help
        }
      };

      newRecognition.onend = () => {
        console.log('🛑 Recognition ended');
        setIsListening(false);

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }

        // Only restart if audio navigation is on and no critical error occurred
        if (isAudioNavigationModeRef.current && mountedRef.current && !criticalErrorRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isAudioNavigationModeRef.current && mountedRef.current) {
              startListening();
            }
          }, 500);
        }
      };

      newRecognition.start();
    } catch (error) {
      console.error('💥 Setup error:', error);
      setIsListening(false);
      recognitionRef.current = null;
      setAnnouncement(
        t('voiceRecognitionFailed', {
          english: 'Voice recognition failed. Please refresh and try again.',
          hausa: 'Amfani da murya ya kasa. Da fatan za a sake loda kuma a gwada.',
          kanuri: 'Murya amfani kasa. Sake loda kuma gwada.',
          arabic: 'فشل التعرف على الصوت. الرجاء التحديث وحاول مرة أخرى.',
        })
      );
      speakText(announcement, 'high');
    }
  }, [isListening, handleVoiceCommand, speakText, language, t]);

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping recognition');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping:', error);
      }
      recognitionRef.current = null;
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    setIsListening(false);
  }, []);

  const announceCurrentFocus = useCallback(() => {
    if (currentFocus) {
      setAnnouncement(
        t('currentFocus', {
          english: `Currently focused on: ${currentFocus}`,
          hausa: `A halin yanzu an mayar da hankali ga: ${currentFocus}`,
          kanuri: `Halin yanzu hankali mayar: ${currentFocus}`,
          arabic: `التركيز حاليًا على: ${currentFocus}`,
        })
      );
      speakText(announcement, 'medium');
    } else {
      setAnnouncement(
        t('noFocus', {
          english: "No current focus. Say 'help' for available commands.",
          hausa: "Babu abin da aka mayar da hankali gare shi. Ka ce 'taimako'.",
          kanuri: "Halin yanzu hankali babu. 'Taimako' ce.",
          arabic: "لا يوجد تركيز. قل 'مساعدة'.",
        })
      );
      speakText(announcement, 'medium');
    }
  }, [currentFocus, speakText, t]);

  useEffect(() => {
    if (isAudioNavigationMode && mounted) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition for language change:', e);
        }
        recognitionRef.current = null;
      }

      const timer = setTimeout(() => startListening(), 100);
      return () => clearTimeout(timer);
    } else if (!isAudioNavigationMode) {
      stopListening();
    }
  }, [isAudioNavigationMode, mounted, language, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        recognitionRef.current = null;
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AudioNavigationContext.Provider
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
      }}
    >
      {children}
    </AudioNavigationContext.Provider>
  );
}

export function useAudioNavigation() {
  const context = useContext(AudioNavigationContext);
  if (context === undefined) {
    throw new Error('useAudioNavigation must be used within an AudioNavigationProvider');
  }
  return context;
}
