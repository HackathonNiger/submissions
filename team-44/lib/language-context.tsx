"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { getUser } from "./auth"
import type { Language } from "./types"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, translations: Record<Language, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("english")

  useEffect(() => {
    const user = getUser()
    if (user && user.language !== language) {
      setLanguage(user.language)
    }
  }, [language])

  const t = (key: string, translations: Record<Language, string>) => {
    return translations[language] || translations.english || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Common translations
export const translations = {
  // Navigation
  dashboard: {
    english: "Dashboard",
    hausa: "Babban Shafi",
    kanuri: "Babban Shafi", 
    arabic: "لوحة القيادة"
  },
  settings: {
    english: "Settings",
    hausa: "Saitunan",
    kanuri: "Saitunan",
    arabic: "الإعدادات"
  },
  progress: {
    english: "Progress",
    hausa: "Ci gaba",
    kanuri: "Ci gaba",
    arabic: "التقدم"
  },
  logout: {
    english: "Logout",
    hausa: "Fita",
    kanuri: "Fita",
    arabic: "تسجيل الخروج"
  },
  
  // Greetings
  welcome: {
    english: "Welcome!",
    hausa: "Barka da zuwa!",
    kanuri: "Barka da zuwa!",
    arabic: "مرحبا بك!"
  },
  
  // Math Topics
  basicMath: {
    english: "Basic Math",
    hausa: "Lissafin Farko",
    kanuri: "Lissafin Farko",
    arabic: "الرياضيات الأساسية"
  },
  intermediateMath: {
    english: "Intermediate Math",
    hausa: "Lissafin Matsakaici",
    kanuri: "Lissafin Matsakaici", 
    arabic: "الرياضيات المتوسطة"
  },
  algebra: {
    english: "Algebra",
    hausa: "Algebra",
    kanuri: "Algebra",
    arabic: "الجبر"
  },
  
  // Actions
  startLearning: {
    english: "Start Learning",
    hausa: "Fara Koyo",
    kanuri: "Fara Koyo",
    arabic: "ابدأ التعلم"
  },
  continueLesson: {
    english: "Continue Last Lesson",
    hausa: "Ci gaba da Darasi na Ƙarshe",
    kanuri: "Ci gaba da Darasi na Ƙarshe",
    arabic: "متابعة الدرس الأخير"
  },
  chooseLanguage: {
    english: "Choose Your Language",
    hausa: "Zaɓi Harshenka",
    kanuri: "Kəmma Harshenka",
    arabic: "اختر لغتك"
  },
  chooseTopic: {
    english: "Choose a Topic",
    hausa: "Zaɓi Batu",
    kanuri: "Zaɓi Batu",
    arabic: "اختر موضوعًا"
  },
  startLesson: {
    english: "Start Lesson",
    hausa: "Fara Darasi",
    kanuri: "Fara Darasi",
    arabic: "ابدأ الدرس"
  },
  review: {
    english: "Review",
    hausa: "Sake Dubawa",
    kanuri: "Sake Dubawa",
    arabic: "مراجعة"
  },
  locked: {
    english: "Locked",
    hausa: "Kulle",
    kanuri: "Kulle",
    arabic: "مقفل"
  },
  back: {
    english: "Back",
    hausa: "Koma",
    kanuri: "Koma",
    arabic: "رجوع"
  },
  language: {
    english: "Language",
    hausa: "Harshe",
    kanuri: "Harshe",
    arabic: "اللغة"
  },
  changeLanguage: {
    english: "Change your learning language",
    hausa: "Canza harshen koyo",
    kanuri: "Canza harshen koyo",
    arabic: "تغيير لغة التعلم"
  },
  changeLanguageButton: {
    english: "Change Language",
    hausa: "Canza Harshe",
    kanuri: "Canza Harshe",
    arabic: "تغيير اللغة"
  },
  accessibility: {
    english: "Accessibility Settings",
    hausa: "Saitunan Samun Dama",
    kanuri: "Saitunan Samun Dama",
    arabic: "إعدادات إمكانية الوصول"
  },
  customizeApp: {
    english: "Customize the app for your needs",
    hausa: "Daidaita app don bukatunka",
    kanuri: "Daidaita app bukatunka",
    arabic: "تخصيص التطبيق لاحتياجاتك"
  },
  normal: {
    english: "Normal",
    hausa: "Na Yau da Kullun",
    kanuri: "Na Yau da Kullun",
    arabic: "عادي"
  },
  slow: {
    english: "Slow",
    hausa: "Sannu",
    kanuri: "Sannu",
    arabic: "بطيء"
  },
  verySlow: {
    english: "Very Slow",
    hausa: "Sannu Sosai",
    kanuri: "Sannu Sosai",
    arabic: "بطيء جدًا"
  },
  high: {
    english: "High",
    hausa: "Babba",
    kanuri: "Babba",
    arabic: "عالي"
  },
  audioNavigation: {
    english: "Full Audio Navigation",
    hausa: "Sauti Cikakke",
    kanuri: "Sauti Cikakke",
    arabic: "التنقل الصوتي الكامل"
  },
  audioNavigationDesc: {
    english: "Use the app with voice only",
    hausa: "Amfani da app da sauti kawai",
    kanuri: "App sauti kawai amfani",
    arabic: "استخدام التطبيق بالصوت فقط"
  },
  dyslexiaFontDesc: {
    english: "Easier to read font",
    hausa: "Rubutu mai sauƙin karatu",
    kanuri: "Rubutu mai sauƙi",
    arabic: "خط أسهل للقراءة"
  },
  subtitlesDesc: {
    english: "Show text with audio",
    hausa: "Nuna rubutu tare da sauti",
    kanuri: "Nuna rubutu sauti tare",
    arabic: "إظهار النص مع الصوت"
  },
  audioPitch: {
    english: "Audio Pitch",
    hausa: "Sautin Sauti",
    kanuri: "Sautin Sauti",
    arabic: "نبرة الصوت"
  },
  
  // Progress
  stars: {
    english: "Stars",
    hausa: "Taurari",
    kanuri: "Taurari",
    arabic: "نجوم"
  },
  completed: {
    english: "Completed",
    hausa: "An gama",
    kanuri: "An gama",
    arabic: "مكتمل"
  },
  
  // Accessibility
  audioSpeed: {
    english: "Audio Speed",
    hausa: "Saurin Sauti",
    kanuri: "Saurin Sauti",
    arabic: "سرعة الصوت"
  },
  subtitles: {
    english: "Subtitles",
    hausa: "Rubutun Sauti",
    kanuri: "Rubutun Sauti", 
    arabic: "الترجمة"
  },
  dyslexiaFont: {
    english: "Dyslexia-Friendly Font",
    hausa: "Rubutu mai Sauƙi",
    kanuri: "Rubutu mai Sauƙi",
    arabic: "خط صديق لعسر القراءة"
  }
}