"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { getUser, updateUser, isAuthenticated } from "@/lib/auth"
import type { Language } from "@/lib/types"
import { BookOpen } from "lucide-react"

export default function LanguageSelectPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  const handleLanguageSelect = (language: Language) => {
    updateUser({ language })
    router.push("/dashboard")
  }

  if (!mounted) return null

  const user = getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Learnbridge</h1>
          </div>
        </div>
        <div className="bg-card p-8 rounded-2xl shadow-lg">
          <LanguageSelector onSelect={handleLanguageSelect} currentLanguage={user?.language} />
        </div>
      </div>
    </div>
  )
}