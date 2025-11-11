// hooks/useCalendarData.ts
import { ActivityData, CalendarDay } from '@/lib/types'
import { useMemo } from 'react'


export const useCalendarData = (year: number, month: number, activityData: ActivityData): CalendarDay[] => {
  return useMemo(() => {
    const firstDay = new Date(Date.UTC(year, month, 1))
    const lastDay = new Date(Date.UTC(year, month + 1, 0))
    const daysInMonth = lastDay.getDate()
    const firstDayOfWeek = firstDay.getDay() // 0 (Sunday) to 6 (Saturday)
    const calendarDays: CalendarDay[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ date: '', count: 0 })
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0]
      calendarDays.push({ date: dateStr, count: activityData[dateStr] || 0 })
    }

    return calendarDays
  }, [year, month, activityData])
}