// hooks/useAggregatedData.ts
import { AggregatedData, QuizScore } from '@/lib/types'
import { useMemo } from 'react'


export const useAggregatedData = (scores: QuizScore[], period: string): AggregatedData => {
  return useMemo(() => {
    const labels: string[] = []
    const dataValues: number[] = []

    if (period === 'daily') {
      scores.forEach((score) => {
        const date = new Date(score.taken_at).toLocaleDateString()
        labels.push(date)
        dataValues.push(score.points)
      })
    } else if (period === 'weekly') {
      const weekMap: { [key: string]: number[] } = {}
      scores.forEach((score) => {
        const date = new Date(score.taken_at)
        const year = date.getFullYear()
        const week = getISOWeek(date)
        const key = `${year}-W${week}`
        if (!weekMap[key]) weekMap[key] = []
        weekMap[key].push(score.points)
      })

      Object.keys(weekMap)
        .sort()
        .forEach((key) => {
          labels.push(key)
          const avg = weekMap[key].reduce((sum, val) => sum + val, 0) / weekMap[key].length
          dataValues.push(Number(avg.toFixed(2)))
        })
    } else if (period === 'monthly') {
      const monthMap: { [key: string]: number[] } = {}
      scores.forEach((score) => {
        const date = new Date(score.taken_at)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`
        if (!monthMap[key]) monthMap[key] = []
        monthMap[key].push(score.points)
      })

      Object.keys(monthMap)
        .sort()
        .forEach((key) => {
          const [year, month] = key.split('-')
          labels.push(new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short', year: 'numeric' }))
          const avg = monthMap[key].reduce((sum, val) => sum + val, 0) / monthMap[key].length
          dataValues.push(Number(avg.toFixed(2)))
        })
    } else if (period === 'yearly') {
      const yearMap: { [key: string]: number[] } = {}
      scores.forEach((score) => {
        const date = new Date(score.taken_at)
        const key = date.getFullYear().toString()
        if (!yearMap[key]) yearMap[key] = []
        yearMap[key].push(score.points)
      })

      Object.keys(yearMap)
        .sort()
        .forEach((key) => {
          labels.push(key)
          const avg = yearMap[key].reduce((sum, val) => sum + val, 0) / yearMap[key].length
          dataValues.push(Number(avg.toFixed(2)))
        })
    }

    return { labels, dataValues }
  }, [scores, period])
}

const getISOWeek = (date: Date) => {
  const tempDate = new Date(date.getTime())
  tempDate.setHours(0, 0, 0, 0)
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7))
  const week1 = new Date(tempDate.getFullYear(), 0, 4)
  return Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7) + 1
}