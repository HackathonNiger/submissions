"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, isAuthenticated } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Star, Target, TrendingUp } from "lucide-react"
import { lessons } from "@/lib/lessons-data"
import { useLanguage, translations } from "@/lib/language-context"
import { useAudioNavigation } from "../../lib/vosk-audio-navigation-context"

export default function ProgressPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { t, language } = useLanguage()
  const { speakText, setCurrentFocus, isAudioNavigationMode } = useAudioNavigation()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  // Set focus when audio navigation is active and announce progress
  useEffect(() => {
    if (isAudioNavigationMode && mounted) {
      setCurrentFocus("Progress")
      
      // Announce progress stats automatically
      setTimeout(() => {
        const user = getUser()
        if (user) {
          const totalLessons = lessons.length
          const completedLessons = Object.values(user.progress).filter((p) => p.completed).length
          const totalStars = Object.values(user.progress).reduce((sum, p) => sum + (p.stars || 0), 0)
          
          const announcement = language === 'english' 
            ? `Your progress: You have completed ${completedLessons} out of ${totalLessons} lessons and earned ${totalStars} stars. Use global commands to navigate.`
            : language === 'hausa'
            ? `Ci gaban ka: Ka kammala darussa ${completedLessons} daga cikin ${totalLessons} kuma ka sami taurari ${totalStars}. Yi amfani da umarnin gaba daya don kewayawa.`
            : language === 'kanuri'
            ? `Ci gaban ka: Darussa ${completedLessons} ${totalLessons} daga kammala ka taurari ${totalStars} sami. Gaba daya umarni kewayawa don amfani.`
            : `تقدمك: لقد أكملت ${completedLessons} من أصل ${totalLessons} درسًا وحصلت على ${totalStars} نجمة. استخدم الأوامر العامة للتنقل.`
          
          speakText(announcement, 'medium')
        }
      }, 2000) // Wait 2 seconds after welcome message
    }
  }, [isAudioNavigationMode, mounted, setCurrentFocus, language, speakText])

  if (!mounted) return null

  const user = getUser()
  if (!user) return null

  const totalLessons = lessons.length
  const completedLessons = Object.values(user.progress).filter((p) => p.completed).length
  const totalStars = Object.values(user.progress).reduce((sum, p) => sum + (p.stars || 0), 0)
  const totalAttempts = Object.values(user.progress).reduce((sum, p) => sum + (p.attempts || 0), 0)

  const averageStars = completedLessons > 0 ? (totalStars / completedLessons).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-slide-up">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="hover:shadow-glow hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("progress", translations.progress)}
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Total Stars */}
          <Card className="border-accent/20 shadow-lg hover:shadow-glow transition-all animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-6 w-6 text-accent" />
                {t("totalStars", {
                  english: "Total Stars",
                  hausa: "Jimlar Taurari",
                  kanuri: "Jimlar Taurari",
                  arabic: "إجمالي النجوم"
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-accent">{totalStars}</p>
              <div className="flex gap-1 mt-2">
                {[...Array(Math.min(totalStars, 10))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Lessons */}
          <Card className="border-primary/20 shadow-lg hover:shadow-glow transition-all animate-scale-in" style={{ animationDelay: '0.05s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-primary" />
                {t("completedLessons", {
                  english: "Completed Lessons",
                  hausa: "Darussa Da Aka Kammala",
                  kanuri: "Darussa Da Aka Kammala",
                  arabic: "الدروس المكتملة"
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary">
                {completedLessons}/{totalLessons}
              </p>
              <div className="w-full bg-muted rounded-full h-3 mt-4">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Total Attempts */}
          <Card className="border-secondary/20 shadow-lg hover:shadow-glow transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-secondary" />
                {t("totalAttempts", {
                  english: "Total Attempts",
                  hausa: "Jimlar Gwaje-gwaje",
                  kanuri: "Jimlar Gwaje-gwaje",
                  arabic: "إجمالي المحاولات"
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-secondary">{totalAttempts}</p>
            </CardContent>
          </Card>

          {/* Average Stars */}
          <Card className="border-accent/20 shadow-lg hover:shadow-glow transition-all animate-scale-in" style={{ animationDelay: '0.15s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-6 w-6 text-accent" />
                {t("averageStars", {
                  english: "Average Stars",
                  hausa: "Matsakaicin Taurari",
                  kanuri: "Matsakaicin Taurari",
                  arabic: "متوسط النجوم"
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-accent">{averageStars}</p>
            </CardContent>
          </Card>
        </div>

        {/* Encouragement Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/10 animate-fade-in">
          <CardContent className="pt-6">
            <p className="text-xl font-semibold text-center text-balance">
              {completedLessons === 0
                ? t("startJourney", {
                    english: "Start your learning journey today! 🚀",
                    hausa: "Fara tafiyarka ta koyo yau! 🚀",
                    kanuri: "Fara tafiyarka ta koyo yau! 🚀",
                    arabic: "ابدأ رحلة التعلم اليوم! 🚀"
                  })
                : completedLessons < totalLessons / 2
                  ? t("keepGoing", {
                      english: "You're doing great! Keep it up! 💪",
                      hausa: "Kana yin kyau! Ci gaba da aiki! 💪",
                      kanuri: "Kana yin kyau! Ci gaba! 💪",
                      arabic: "أنت تقوم بعمل رائع! استمر! 💪"
                    })
                  : completedLessons < totalLessons
                    ? t("almostThere", {
                        english: "You're almost there! 🌟",
                        hausa: "Kuna kusa da kammala! 🌟",
                        kanuri: "Kuna kusa da kammala! 🌟",
                        arabic: "أنت قريب من الانتهاء! 🌟"
                      })
                    : t("allComplete", {
                        english: "Excellent! You’ve completed all lessons! 🎉",
                        hausa: "Madalla! Ka kammala dukkan darussa! 🎉",
                        kanuri: "Madalla! Ka kammala dukkan darussa! 🎉",
                        arabic: "ممتاز! لقد أكملت جميع الدروس! 🎉"
                      })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
