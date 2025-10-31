"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lesson, Language } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Star, Lock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface LessonCardProps {
  lesson: Lesson
  language: Language
  stars?: number
  completed?: boolean
  locked?: boolean
  onClick: () => void
}

export function LessonCard({
  lesson,
  language,
  stars = 0,
  completed = false,
  locked = false,
  onClick,
}: LessonCardProps) {
  const { t } = useLanguage()
  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${locked ? "opacity-60" : "cursor-pointer"}`}
      onClick={locked ? undefined : onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="text-5xl mb-2">{lesson.icon}</div>
          {locked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : stars > 0 ? (
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < stars ? "fill-accent text-accent" : "text-muted"}`} />
              ))}
            </div>
          ) : null}
        </div>
        <CardTitle className="text-xl text-balance">{lesson.title[language]}</CardTitle>
        <CardDescription className="text-base">{lesson.description[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" size="lg" disabled={locked}>
          {locked
            ? t("locked", {
                english: "Locked",
                hausa: "Kulle",
                kanuri: "Kulle",
                arabic: "مقفل"
              })
            : completed
              ? t("review", {
                  english: "Review",
                  hausa: "Sake Dubawa",
                  kanuri: "Sake Dubawa",
                  arabic: "مراجعة"
                })
              : t("startLesson", {
                  english: "Start Lesson",
                  hausa: "Fara Darasi",
                  kanuri: "Fara Darasi",
                  arabic: "ابدأ الدرس"
                })}
        </Button>
      </CardContent>
    </Card>
  )
}