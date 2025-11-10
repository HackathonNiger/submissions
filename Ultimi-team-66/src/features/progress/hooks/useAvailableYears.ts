// hooks/useAvailableYears.ts
import { QuizScore } from '@/lib/types'
import { useMemo } from 'react'



export const useAvailableYears = (scores: QuizScore[]) => {
  return useMemo(() => {
    const years = new Set<number>()
    scores.forEach((score) => {
      years.add(new Date(score.taken_at).getFullYear())
    })
    return Array.from(years).sort()
  }, [scores])
}