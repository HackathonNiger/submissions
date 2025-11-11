// // app/progress/page.module.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useTheme } from 'next-themes'
// // import { cn } from '@/lib/utils'
// import { useActivityData, useAggregatedData, useAvailableYears, useQuizScores } from '@/features/progress/hooks'
// import { ActivityCalendar, ProgressChart } from '@/features/progress/components'
// export default function ProgressPage() {
//   const { theme } = useTheme()
//   const { scores, loading, error } = useQuizScores()
//   const [filter, setFilter] = useState('daily')
//   const [chartType, setChartType] = useState('line')
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

//   const aggregatedData = useAggregatedData(scores, filter)
//   const activityData = useActivityData(scores)
//   const availableYears = useAvailableYears(scores)

//   useEffect(() => {
//     if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
//       setSelectedYear(availableYears[availableYears.length - 1])
//     }
//   }, [availableYears, selectedYear])

//   if (error) {
//     return (
//       <div className={`min-h-screen flex-1 p-4 sm:p-8 transition-all duration-500 ${theme === 'custom' ? 'bg-slate-50' : theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} flex items-center justify-center`}>
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-500">Error</h1>
//           <p>{error}</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`min-h-screen flex-1 p-4 sm:p-8 transition-all duration-500 ${theme === 'custom' ? 'bg-slate-50' : theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
//       <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-8">
//         <ProgressChart
//           aggregatedData={aggregatedData}
//           loading={loading}
//           onChartTypeChange={setChartType}
//           onFilterChange={setFilter}
//           chartType={chartType}
//           filter={filter}
//         />
//         <ActivityCalendar
//           activityData={activityData}
//           availableYears={availableYears}
//           loading={loading}
//           onYearChange={setSelectedYear}
//           selectedYear={selectedYear}
//         />
//       </div>
//     </div>
//   )
// }




// app/progress/page.module.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Head from "next/head";
// import { cn } from '@/lib/utils'
import { useActivityData, useAggregatedData, useAvailableYears, useQuizScores } from '@/features/progress/hooks'
import { ActivityCalendar, ProgressChart } from '@/features/progress/components'
import Box from '@/components/ui/box'
export default function ProgressPage() {
  const { theme } = useTheme()
  const { scores, loading, error } = useQuizScores()
  const [filter, setFilter] = useState('daily')
  const [chartType, setChartType] = useState('line')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const aggregatedData = useAggregatedData(scores, filter)
  const activityData = useActivityData(scores)
  const availableYears = useAvailableYears(scores)

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1])
    }
  }, [availableYears, selectedYear])

  if (error) {
    return (
      <Box as="div" className={`min-h-screen flex-1 p-2 xs414:p-4 sm:p-6 lg:p-8 transition-all duration-500 ${theme === 'custom' ? 'bg-slate-50' : theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} flex items-center justify-center`}>
        <Box as="div"className="text-center">
          <h1 className="text-xl xs414:text-2xl font-bold text-red-500">Error</h1>
          <p className="text-sm xs414:text-base">{error}</p>
        </Box>
      </Box>
    )
  }

  return (
    <Box as="div" className={`min-h-screen flex-1 p-2 xs414:p-4 sm:p-6 lg:p-8 transition-all duration-500 ${theme === 'custom' ? 'bg-slate-50' : theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <Box as="div" className=" max-w-7xl mx-auto w-full grid grid-cols-1 tab1024:grid-cols-2 gap-2 xs414:gap-4 sm:gap-6 lg:gap-8">
        <Head>
        <title>Progress | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </Head>
        <ProgressChart
          aggregatedData={aggregatedData}
          loading={loading}
          onChartTypeChange={setChartType}
          onFilterChange={setFilter}
          chartType={chartType}
          filter={filter}
        />
        <ActivityCalendar
          activityData={activityData}
          availableYears={availableYears}
          loading={loading}
          onYearChange={setSelectedYear}
          selectedYear={selectedYear}
        />
      </Box>
    </Box>
  )
}