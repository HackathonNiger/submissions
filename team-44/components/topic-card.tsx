"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Language, MathTopic } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useLanguage, translations } from "@/lib/language-context"

interface TopicCardProps {
  topic: MathTopic
  language: Language
  completedLessons: number
  totalLessons: number
  onClick: () => void
}

const topicData = {
  basic: {
    title: {
      english: "Basic Math",
      hausa: "Lissafi na Asali",
      kanuri: "Lissafi Asali",
      arabic: "الرياضيات الأساسية",
    },
    description: {
      english: "Counting, Addition, Subtraction, and More",
      hausa: "Ƙidaya, Ƙari, Ragi, da Sauransu",
      kanuri: "Kərəwa, Kəmma, Ragi",
      arabic: "العد، الجمع، الطرح، والمزيد",
    },
    icon: "🔢",
    color: "bg-primary",
  },
  intermediate: {
    title: {
      english: "Intermediate Math",
      hausa: "Lissafi na Matsakaici",
      kanuri: "Lissafi Matsakaici",
      arabic: "الرياضيات المتوسطة",
    },
    description: {
      english: "Percentages, Time, Measurement",
      hausa: "Kashi Ɗari, Lokaci, Auna",
      kanuri: "Kashi Dari, Lokaci, Auna",
      arabic: "النسب المئوية، الوقت، القياس",
    },
    icon: "📊",
    color: "bg-secondary",
  },
  algebra: {
    title: {
      english: "Algebra (Introduction)",
      hausa: "Algebra (Gabatarwa)",
      kanuri: "Algebra",
      arabic: "الجبر (مقدمة)",
    },
    description: {
      english: "Variables, Equations",
      hausa: "Masu Canzawa, Ma'auni",
      kanuri: "Masu Canzawa, Ma'auni",
      arabic: "المتغيرات، المعادلات",
    },
    icon: "🔤",
    color: "bg-accent",
  },
}

export function TopicCard({ topic, language, completedLessons, totalLessons, onClick }: TopicCardProps) {
  const data = topicData[topic]
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const { t } = useLanguage()

  const getGradientClass = () => {
    switch (topic) {
      case 'basic':
        return 'from-primary to-primary/80'
      case 'intermediate':
        return 'from-secondary to-secondary/80'
      case 'algebra':
        return 'from-accent to-accent/80'
      default:
        return 'from-primary to-primary/80'
    }
  }

  const getBorderClass = () => {
    switch (topic) {
      case 'basic':
        return 'border-primary/20 hover:border-primary/40'
      case 'intermediate':
        return 'border-secondary/20 hover:border-secondary/40'
      case 'algebra':
        return 'border-accent/20 hover:border-accent/40'
      default:
        return 'border-primary/20 hover:border-primary/40'
    }
  }

  return (
    <Card 
      className={`hover:shadow-glow transition-all cursor-pointer group relative overflow-hidden ${getBorderClass()}`} 
      onClick={onClick}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getGradientClass()} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`bg-gradient-to-br ${getGradientClass()} text-white p-4 rounded-2xl text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
            {data.icon}
          </div>
          {completedLessons > 0 && (
            <div className="bg-accent/10 p-1 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl text-balance group-hover:text-primary transition-colors">
          {data.title[language]}
        </CardTitle>
        <CardDescription className="text-base">
          {data.description[language]}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              {t("progress", translations.progress)}
            </span>
            <span className="font-bold text-foreground">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${getGradientClass()} h-2.5 rounded-full transition-all duration-500 ease-out`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        <Button className={`w-full mt-4 bg-gradient-to-r ${getGradientClass()} hover:shadow-lg transition-all`} size="lg">
          {t("startLearning", translations.startLearning)}
        </Button>
      </CardContent>
    </Card>
  )
}