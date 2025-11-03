"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, isAuthenticated, logout } from "@/lib/auth"
import { TopicCard } from "@/components/topic-card"
import { Button } from "@/components/ui/button"
import { BookOpen, Settings, LogOut, Trophy } from "lucide-react"
import { lessons } from "@/lib/lessons-data"
import { useLanguage, translations } from "@/lib/language-context"
import { useAudioNavigation } from "../../lib/vosk-audio-navigation-context"
import { useMicrophonePermission } from "@/lib/use-microphone-permission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MathTopic } from "@/lib/types"

function DashboardContent() {
  const router = useRouter()
  const { language, t, setLanguage } = useLanguage()
  const { speakText, setCurrentFocus, isAudioNavigationMode } = useAudioNavigation()
  const { permission, requestPermission } = useMicrophonePermission()
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    } else {
      const user = getUser()
      if (user && user.language !== language) {
        setLanguage(user.language)
      }
      // Show permission dialog if not granted and audio navigation is enabled or user intends to use it
      if (user?.settings?.audioNavigation && permission !== 'granted') {
        setShowPermissionDialog(true)
      }
    }
  }, [router, language, setLanguage, permission])

  // Set focus when audio navigation is active
  useEffect(() => {
    if (isAudioNavigationMode) {
      setCurrentFocus("Dashboard")
    }
  }, [isAudioNavigationMode, setCurrentFocus])

  const user = getUser()
  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getTopicStats = (topic: MathTopic) => {
    const topicLessons = lessons.filter((l) => l.topic === topic)
    const completed = topicLessons.filter((l) => user.progress[l.id]?.completed).length
    return { completed, total: topicLessons.length }
  }

  const totalStars = Object.values(user.progress).reduce((sum, p) => sum + (p.stars || 0), 0)

  const handlePermissionAllow = () => {
    requestPermission()
    setShowPermissionDialog(false)
  }

  const handlePermissionDeny = () => {
    setShowPermissionDialog(false)
  }

  return (
    <>
      <AlertDialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('micPermissionTitle', { 
              english: 'Microphone Access Needed',
              hausa: 'Ana Bukatar Izinin Makirufo',
              kanuri: 'Izinin Makirufo na Bukata',
              arabic: 'الوصول إلى الميكروفون مطلوب'
            })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('micPermissionDescription', { 
                english: 'To use voice commands for navigation, please allow microphone access. You can manage this in your browser settings at any time.',
                hausa: 'Don amfani da umarnin murya don kewayawa, da fatan za a ba da izinin makirufo. Zaka iya sarrafa wannan a cikin saitunan burauzarka a kowane lokaci.',
                kanuri: 'Don amfani da umarnin murya don kewayawa, don Allah ba da izinin makirufo. Zaka iya sarrafa wannan a cikin saitunan burauzarka a kowane lokaci.',
                arabic: ' لاستخدام الأوامر الصوتية للتنقل، يرجى السماح بالوصول إلى الميكروفون. يمكنك إدارة هذا في إعدادات المتصفح في أي وقت'
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handlePermissionDeny}>{t('cancel', { 
              english: 'Cancel',
              hausa: 'Soke',
              kanuri: 'Soke',
              arabic: 'إلغاء'
            })}</AlertDialogCancel>
            <AlertDialogAction onClick={handlePermissionAllow}>{t('allow', {
              english: 'Allow',
              hausa: 'Yarda',
              kanuri: 'Yarda',
              arabic: 'السماح'
            })}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-glow">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Learnbridge
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => router.push("/progress")} 
                title="Progress"
                className="hover:shadow-glow hover:border-primary/50 transition-all"
              >
                <Trophy className="h-5 w-5 text-primary" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => router.push("/settings")} 
                title="Settings"
                className="hover:shadow-glow hover:border-secondary/50 transition-all"
              >
                <Settings className="h-5 w-5 text-secondary" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout} 
                title="Logout"
                className="hover:shadow-glow hover:border-destructive/50 transition-all"
              >
                <LogOut className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="relative bg-gradient-to-br from-card via-card to-primary/5 p-8 rounded-3xl shadow-xl mb-8 border border-primary/10 overflow-hidden animate-slide-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("welcome", translations.welcome)}
              </h2>
              <p className="text-muted-foreground text-lg mb-4">{user.username} ({user.email})</p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-2 rounded-full border border-accent/20">
                <Trophy className="h-5 w-5 text-accent animate-float" />
                <span className="font-semibold text-black text-lg">
                  {totalStars} {t("stars", translations.stars)}
                </span>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
              {t("chooseTopic", translations.chooseTopic)}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <TopicCard
                topic="basic"
                language={user.language}
                completedLessons={getTopicStats("basic").completed}
                totalLessons={getTopicStats("basic").total}
                onClick={() => router.push("/topics/basic")}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <TopicCard
                topic="intermediate"
                language={user.language}
                completedLessons={getTopicStats("intermediate").completed}
                totalLessons={getTopicStats("intermediate").total}
                onClick={() => router.push("/topics/intermediate")}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <TopicCard
                topic="algebra"
                language={user.language}
                completedLessons={getTopicStats("algebra").completed}
                totalLessons={getTopicStats("algebra").total}
                onClick={() => router.push("/topics/algebra")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <DashboardContent />
}