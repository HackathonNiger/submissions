// hooks/useActivityData.ts
import { QuizScore } from '@/lib/types'
import { useMemo } from 'react'


export const useActivityData = (scores: QuizScore[]) => {
  return useMemo(() => {
    const activityMap: { [key: string]: number } = {}
    scores.forEach((score) => {
      const date = new Date(score.taken_at).toISOString().split('T')[0]
      activityMap[date] = (activityMap[date] || 0) + 1
    })
    return activityMap
  }, [scores])
}