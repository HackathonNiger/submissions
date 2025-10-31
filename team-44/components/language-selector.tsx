"use client"

import type { Language } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface LanguageSelectorProps {
  onSelect: (language: Language) => void
  currentLanguage?: Language
}

const languages = [
  { code: "english" as Language, name: "English", flag: "🇬🇧" },
  { code: "hausa" as Language, name: "Hausa", flag: "🇳🇬" },
  { code: "kanuri" as Language, name: "Kanuri", flag: "🇳🇬" },
  { code: "arabic" as Language, name: "العربية", flag: "🇸🇦" },
]

export function LanguageSelector({ onSelect, currentLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-balance">Choose Your Language</h2>
      <p className="text-center text-muted-foreground text-lg">
        Choose your language / Zaɓi harshenka / Kəmma harshenka / اختر لغتك
      </p>
      <div className="grid gap-3 mt-4">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            size="lg"
            variant={currentLanguage === lang.code ? "default" : "outline"}
            className="h-16 text-xl font-semibold"
          >
            <span className="text-3xl mr-3">{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  )
}