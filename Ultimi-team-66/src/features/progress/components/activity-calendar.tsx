'use client'

import { useState, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityCalendarProps } from '@/lib/types'
import Box from '@/components/ui/box'
import { useCurrentDate } from '../hooks/useCurrentDate'

const months = Array.from({ length: 12 }, (_, i) => ({
  index: i,
  name: new Date(2023, i, 1).toLocaleString('default', { month: 'long' }),
}))

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activityData,
  availableYears,
  loading,
  onYearChange,
  selectedYear,
}) => {
  const { theme } = useTheme()
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [initialScrollDone, setInitialScrollDone] = useState(false)
  const currentDate = useCurrentDate()
  const currentYear = new Date().getFullYear()
   console.log({selectedMonth})
  const allCalendarDays = useMemo(() => {
    return months.map((month) => {
      const firstDay = new Date(Date.UTC(selectedYear, month.index, 1))
      const lastDay = new Date(Date.UTC(selectedYear, month.index + 1, 0))
      const daysInMonth = lastDay.getDate()
      const firstDayOfWeek = firstDay.getDay()
      const calendarDays: { date: string; count: number }[] = []

      // Empty slots before first day of month
      for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push({ date: '', count: 0 })
      }

      // Actual days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(Date.UTC(selectedYear, month.index, day))
        const dateStr = dateObj.toISOString().split('T')[0]

        // Show only October 1 onward for current year
        const showDate =
          selectedYear === currentYear
            ? month.index > 9 // November, December
              ? true
              : month.index === 9 && day >= 1 // October days
            : true // Past years: show all

        calendarDays.push({
          date: showDate ? dateStr : '',
          count: showDate ? activityData[dateStr] || 0 : 0,
        })
      }

      return calendarDays
    })
  }, [selectedYear, activityData, currentYear])

  const getColorForCount = (count: number) => {
    if (count === 0)
      return theme === 'custom'
        ? '#f1f5f9'
        : theme === 'light'
        ? '#f3f4f6'
        : '#1e293b'
    if (count === 1)
      return theme === 'custom'
        ? '#bae6fd'
        : theme === 'light'
        ? '#93c5fd'
        : '#3b82f6'
    if (count === 2)
      return theme === 'custom'
        ? '#7dd3fc'
        : theme === 'light'
        ? '#67e8f9'
        : '#06b6d4'
    if (count >= 3 && count <= 9)
      return theme === 'custom'
        ? '#34d399'
        : theme === 'light'
        ? '#34d399'
        : '#10b981'
    if (count >= 10) return '#f59e0b'
    return theme === 'custom'
      ? '#f1f5f9'
      : theme === 'light'
      ? '#f3f4f6'
      : '#1e293b'
  }

  if (loading) {
    return (
      <Card
        className={`bg-white dark:bg-black/40 border ${
          theme === 'custom'
            ? 'border-blue-400'
            : theme === 'light'
            ? 'border-gray-200'
            : 'border-cyan-500/30'
        } shadow-md rounded-2xl mb-[300px] sm:mb-[0px]`}
      >
        <CardHeader>
          <CardTitle
            className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${
              theme === 'custom'
                ? 'from-blue-400 to-blue-600'
                : theme === 'light'
                ? 'from-blue-600 to-indigo-600'
                : 'from-cyan-400 to-fuchsia-500'
            } bg-clip-text text-transparent`}
          >
            Quiz Activity Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Skeleton
            className={`w-full h-[200px] rounded-xl bg-gradient-to-r ${
              theme === 'custom'
                ? 'from-blue-100 to-blue-200'
                : theme === 'light'
                ? 'from-gray-100 to-gray-200'
                : 'from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10'
            } animate-pulse`}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`bg-white dark:bg-black/40 border ${
        theme === 'custom'
          ? 'border-blue-400'
          : theme === 'light'
          ? 'border-gray-200'
          : 'border-cyan-500/30'
      } shadow-md rounded-2xl`}
    >
      <CardHeader>
        <CardTitle
          className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${
            theme === 'custom'
              ? 'from-blue-400 to-blue-600'
              : theme === 'light'
              ? 'from-blue-600 to-indigo-600'
              : 'from-cyan-400 to-fuchsia-500'
          } bg-clip-text text-transparent`}
        >
          Quiz Activity Calendar
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Year Buttons */}
        <Box as="div" className="flex flex-wrap gap-2 mb-4 justify-center">
          {availableYears.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onYearChange(year)
                setSelectedMonth(0)
              }}
              className={`${
                selectedYear === year
                  ? theme === 'custom'
                    ? 'bg-blue-400 text-white'
                    : theme === 'light'
                    ? 'bg-blue-500 text-white'
                    : 'bg-cyan-500 text-white'
                  : theme === 'custom'
                  ? 'bg-white border-blue-400 text-blue-400'
                  : theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-black/50 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {year}
            </Button>
          ))}
        </Box>

        {/* Activity Key */}
        <Box
          as="div"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4"
        >
          <Box
            as="span"
            className={`text-sm ${
              theme === 'custom'
                ? 'text-gray-700'
                : theme === 'light'
                ? 'text-gray-700'
                : 'text-cyan-300'
            }`}
          >
            Quiz Activity Key:
          </Box>
          <Box as="div" className="flex flex-wrap items-center gap-1">
            {[0, 1, 2, 3, 10].map((count) => (
              <Box as="div" key={count} className="flex items-center gap-1">
                <Box
                  as="div"
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
                  style={{ backgroundColor: getColorForCount(count) }}
                />
                <Box
                  as="span"
                  className={`text-xs ${
                    theme === 'custom'
                      ? 'text-gray-700'
                      : theme === 'light'
                      ? 'text-gray-700'
                      : 'text-cyan-300'
                  }`}
                >
                  {count === 0
                    ? 'No quizzes'
                    : count === 3
                    ? '3–9 quizzes'
                    : count === 10
                    ? '10+ quizzes'
                    : `${count} quiz${count !== 1 ? 'zes' : ''}`}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Month Carousel */}
        <Carousel
          setApi={(api) => {
            if (api && !initialScrollDone) {
              const currentMonthIndex = new Date(currentDate).getUTCMonth()
              api.scrollTo(currentMonthIndex, true)
              setSelectedMonth(currentMonthIndex)
              setInitialScrollDone(true)

              api.on('select', () => {
                setSelectedMonth(api.selectedScrollSnap())
              })
            }
          }}
          className="w-full max-w-md mx-auto"
          opts={{ align: 'start', loop: false }}
        >
          <CarouselContent>
            {months.map((month) => {
              const calendarDays = allCalendarDays[month.index]
              return (
                <CarouselItem key={month.index}>
                  <Box as="div" className="p-4">
                    <Box
                      as="h4"
                      className={`text-center mb-2 ${
                        theme === 'custom'
                          ? 'text-gray-900'
                          : theme === 'light'
                          ? 'text-gray-900'
                          : 'text-cyan-300'
                      }`}
                    >
                      {month.name} {selectedYear}
                    </Box>
                    <Box className="grid grid-cols-7 gap-1 text-xs">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        (day) => (
                          <Box
                            as="div"
                            key={day}
                            className={`text-center ${
                              theme === 'custom'
                                ? 'text-gray-900'
                                : theme === 'light'
                                ? 'text-gray-900'
                                : 'text-cyan-300'
                            }`}
                          >
                            {day}
                          </Box>
                        ),
                      )}
                      {calendarDays.map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{
                            scale: day.date === currentDate ? 0.8 : 1,
                            opacity: 0.8,
                          }}
                          animate={{
                            scale: day.date === currentDate ? 1 : 1,
                            opacity: 1,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`w-8 h-8 flex items-center justify-center rounded-sm ${
                            theme === 'custom'
                              ? 'text-gray-900'
                              : theme === 'light'
                              ? 'text-gray-900'
                              : 'text-white'
                          } ${day.date ? 'cursor-pointer' : ''} ${
                            day.date === currentDate
                              ? theme === 'custom'
                                ? 'border-2 border-blue-400'
                                : theme === 'light'
                                ? 'border-2 border-blue-500'
                                : 'border-2 border-cyan-500'
                              : ''
                          }`}
                          style={{ backgroundColor: getColorForCount(day.count) }}
                          title={
                            day.date
                              ? `${day.date}: ${day.count} quiz${
                                  day.count !== 1 ? 'zes' : ''
                                } taken`
                              : ''
                          }
                        >
                          {day.date ? new Date(day.date).getDate() : ''}
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <CarouselPrevious
            className={`${
              theme === 'custom'
                ? 'bg-white border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white'
                : theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 hover:bg-blue-500/80 hover:text-white'
                : 'bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/80 hover:text-black'
            }`}
          />
          <CarouselNext
            className={`${
              theme === 'custom'
                ? 'bg-white border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white'
                : theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 hover:bg-blue-500/80 hover:text-white'
                : 'bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/80 hover:text-black'
            }`}
          />
        </Carousel>
      </CardContent>
    </Card>
  )
}
