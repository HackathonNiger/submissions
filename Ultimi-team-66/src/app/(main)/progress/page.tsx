// 'use client'

// import { useEffect, useState } from 'react'
// import { useTheme } from 'next-themes'
// import { supabase } from '@/lib/supabaseClient'
// import { cn } from '@/lib/utils';

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
// import { Skeleton } from '@/components/ui/skeleton'
// import { Button } from '@/components/ui/button'
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
//   Filler,
// } from 'chart.js'
// import { Line, Bar, Pie, Radar, Doughnut } from 'react-chartjs-2'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
//   Filler
// )

// export default function ProgressPage() {
//   const { theme } = useTheme()
//   const [scores, setScores] = useState<{ points: number; taken_at: string }[]>([])
//   const [filteredData, setFilteredData] = useState<{ labels: string[]; dataValues: number[] }>({ labels: [], dataValues: [] })
//   const [activityData, setActivityData] = useState<{ [key: string]: number }>({})
//   const [loading, setLoading] = useState(true)
//   const [chartType, setChartType] = useState('line')
//   const [filter, setFilter] = useState('daily')
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

//   // Current date in Lagos timezone (Africa/Lagos, UTC+1)

//   const currentDate = new Intl.DateTimeFormat("en-CA", {
//   timeZone: "Africa/Lagos",
//   year: "numeric",
//   month: "2-digit",
//   day: "2-digit",
// })
//   .format(new Date())
//   .replace(/\//g, "-"); // Ensure YYYY-MM-DD format if needed

//   // Helper function to group and aggregate scores by time period
//   const aggregateScores = (scores: { points: number; taken_at: string }[], period: string) => {
//     const labels: string[] = []
//     const dataValues: number[] = []

//     if (period === 'daily') {
//       scores.forEach((score) => {
//         const date = new Date(score.taken_at).toLocaleDateString()
//         labels.push(date)
//         dataValues.push(score.points)
//       })
//     } else if (period === 'weekly') {
//       const weekMap: { [key: string]: number[] } = {}
//       scores.forEach((score) => {
//         const date = new Date(score.taken_at)
//         const year = date.getFullYear()
//         const week = getISOWeek(date)
//         const key = `${year}-W${week}`
//         if (!weekMap[key]) weekMap[key] = []
//         weekMap[key].push(score.points)
//       })

//       Object.keys(weekMap)
//         .sort()
//         .forEach((key) => {
//           labels.push(key)
//           const avg = weekMap[key].reduce((sum, val) => sum + val, 0) / weekMap[key].length
//           dataValues.push(Number(avg.toFixed(2)))
//         })
//     } else if (period === 'monthly') {
//       const monthMap: { [key: string]: number[] } = {}
//       scores.forEach((score) => {
//         const date = new Date(score.taken_at)
//         const key = `${date.getFullYear()}-${date.getMonth() + 1}`
//         if (!monthMap[key]) monthMap[key] = []
//         monthMap[key].push(score.points)
//       })

//       Object.keys(monthMap)
//         .sort()
//         .forEach((key) => {
//           const [year, month] = key.split('-')
//           labels.push(new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short', year: 'numeric' }))
//           const avg = monthMap[key].reduce((sum, val) => sum + val, 0) / monthMap[key].length
//           dataValues.push(Number(avg.toFixed(2)))
//         })
//     } else if (period === 'yearly') {
//       const yearMap: { [key: string]: number[] } = {}
//       scores.forEach((score) => {
//         const date = new Date(score.taken_at)
//         const key = date.getFullYear().toString()
//         if (!yearMap[key]) yearMap[key] = []
//         yearMap[key].push(score.points)
//       })

//       Object.keys(yearMap)
//         .sort()
//         .forEach((key) => {
//           labels.push(key)
//           const avg = yearMap[key].reduce((sum, val) => sum + val, 0) / yearMap[key].length
//           dataValues.push(Number(avg.toFixed(2)))
//         })
//     }

//     return { labels, dataValues }
//   }

//   // Helper function to get ISO week number
//   const getISOWeek = (date: Date) => {
//     const tempDate = new Date(date.getTime())
//     tempDate.setHours(0, 0, 0, 0)
//     tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7))
//     const week1 = new Date(tempDate.getFullYear(), 0, 4)
//     return Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7) + 1
//   }

//   // Helper function to generate activity data
//   const generateActivityData = (scores: { points: number; taken_at: string }[]) => {
//     const activityMap: { [key: string]: number } = {}
//     scores.forEach((score) => {
//       const date = new Date(score.taken_at).toISOString().split('T')[0]
//       activityMap[date] = (activityMap[date] || 0) + 1
//     })
//     return activityMap
//   }

//   // Get available years from scores
//   const getAvailableYears = (scores: { points: number; taken_at: string }[]) => {
//     const years = new Set<number>()
//     scores.forEach((score) => {
//       years.add(new Date(score.taken_at).getFullYear())
//     })
//     return Array.from(years).sort()
//   }

//   useEffect(() => {
//     async function fetchScores() {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('quiz_scores')
//         .select('points, taken_at')
//         .order('taken_at', { ascending: true })

//       if (error) {
//         console.error(error)
//       } else {
//         setScores(data || [])
//         const { labels, dataValues } = aggregateScores(data || [], filter)
//         setFilteredData({ labels, dataValues })
//         setActivityData(generateActivityData(data || []))
//       }
//       setLoading(false)
//     }
//     fetchScores()
//     // eslint-disable-next-line react-hooks/exhaustive-deps 
//   }, [filter])

//   // Chart dataset colors per mode
//   const chartColors: Record<string, { border: string; background: string | string[] }> = {
//     line: { border: theme === 'custom' ? '#60a5fa' : '#2563eb', background: theme === 'custom' ? '#60a5fa33' : '#3b82f633' },
//     curve: { border: theme === 'custom' ? '#93c5fd' : '#d946ef', background: theme === 'custom' ? '#93c5fd33' : '#d946ef33' },
//     area: { border: theme === 'custom' ? '#60a5fa' : '#0ea5e9', background: theme === 'custom' ? '#60a5fa55' : '#0ea5e955' },
//     bar: { border: theme === 'custom' ? '#34d399' : '#10b981', background: theme === 'custom' ? '#34d39999' : '#10b98199' },
//     pie: {
//       border: '#f59e0b',
//       background: theme === 'custom' ? ['#60a5fa', '#93c5fd', '#f59e0b', '#34d399', '#ef4444'] : ['#2563eb', '#d946ef', '#f59e0b', '#10b981', '#ef4444'],
//     },
//     radar: { border: '#ef4444', background: '#ef444455' },
//     radial: {
//       border: theme === 'custom' ? '#60a5fa' : '#0ea5e9',
//       background: theme === 'custom' ? ['#60a5fa', '#93c5fd', '#f59e0b', '#34d399', '#ef4444', '#7dd3fc'] : ['#2563eb', '#d946ef', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
//     },
//   }

//   const chartData = {
//     labels: filteredData.labels,
//     datasets: [
//       {
//         label: 'Points (𝙐𝙥)',
//         data: filteredData.dataValues,
//         borderColor: chartColors[chartType]?.border,
//         backgroundColor: chartColors[chartType]?.background,
//         fill: chartType === 'area' || chartType === 'curve',
//         tension: chartType === 'curve' ? 0.5 : 0,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { labels: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' } },
//       tooltip: {
//         backgroundColor: theme === 'custom' ? '#f8fafc' : theme === 'light' ? '#ffffff' : '#0f172a',
//         borderColor: chartColors[chartType]?.border,
//         borderWidth: 1,
//         titleColor: chartColors[chartType]?.border,
//         bodyColor: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb',
//       },
//     },
//     scales:
//       chartType !== 'pie' && chartType !== 'radial' && chartType !== 'radar'
//         ? {
//             x: {
//               ticks: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' },
//               grid: { color: theme === 'custom' ? '#e5e7eb' : theme === 'light' ? '#e5e7eb' : '#1e293b' },
//             },
//             y: {
//               ticks: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' },
//               grid: { color: theme === 'custom' ? '#e5e7eb' : theme === 'light' ? '#e5e7eb' : '#1e293b' },
//             },
//           }
//         : {},
//   }

//   // Generate calendar data for a specific month
//   const generateMonthCalendar = (year: number, month: number) => {
//     const firstDay = new Date(Date.UTC(year, month, 1))
//     const lastDay = new Date(Date.UTC(year, month + 1, 0))
//     const daysInMonth = lastDay.getDate()
//     const firstDayOfWeek = firstDay.getDay() // 0 (Sunday) to 6 (Saturday)
//     const calendarDays: { date: string; count: number }[] = []

//     // Add empty slots for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       calendarDays.push({ date: '', count: 0 })
//     }

//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateStr = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0]
//       calendarDays.push({ date: dateStr, count: activityData[dateStr] || 0 })
//     }

//     return calendarDays
//   }

//   const getColorForCount = (count: number) => {
//     if (count === 0) return theme === 'custom' ? '#f1f5f9' : theme === 'light' ? '#f3f4f6' : '#1e293b'
//     if (count === 1) return theme === 'custom' ? '#bae6fd' : theme === 'light' ? '#93c5fd' : '#3b82f6'
//     if (count === 2) return theme === 'custom' ? '#7dd3fc' : theme === 'light' ? '#67e8f9' : '#06b6d4'
//     if (count >= 3 && count <= 9) return theme === 'custom' ? '#34d399' : theme === 'light' ? '#34d399' : '#10b981'
//     if (count >= 10) return '#f59e0b' // Amber for all modes
//     return theme === 'custom' ? '#f1f5f9' : theme === 'light' ? '#f3f4f6' : '#1e293b'
//   }

//   const availableYears = getAvailableYears(scores)
//   const months = Array.from({ length: 12 }, (_, i) => ({
//     index: i,
//     name: new Date(2023, i, 1).toLocaleString('default', { month: 'long' }),
//   }))

//   const renderChart = () => {
//     if (chartType === 'line') return <Line data={chartData} options={options} />
//     if (chartType === 'curve') return <Line data={chartData} options={options} />
//     if (chartType === 'area') return <Line data={chartData} options={options} />
//     if (chartType === 'bar') return <Bar data={chartData} options={options} />
//     if (chartType === 'pie') return <Pie data={chartData} options={options} />
//     if (chartType === 'radar') return <Radar data={chartData} options={options} />
//     if (chartType === 'radial') return <Doughnut data={chartData} options={options} />
//     return null
//   }

//   return (
//     <div className={`min-h-screen  flex-1  p-8 transition-all duration-500 ${theme === 'custom' ? 'bg-slate-50' : theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
//       {/* Chart Section */}
//       <Card className={`bg-white dark:bg-black/40 border ${theme === 'custom' ? 'border-blue-400' : theme === 'light' ? 'border-gray-200' : 'border-cyan-500/30'} shadow-md ${theme === 'dark' ? 'dark:shadow-xl dark:shadow-cyan-500/20' : ''} rounded-2xl mb-8`}>
//         <CardHeader>
//           <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${theme === 'custom' ? 'from-blue-400 to-blue-600' : theme === 'light' ? 'from-blue-600 to-indigo-600' : 'from-cyan-400 to-fuchsia-500'} bg-clip-text text-transparent`}>
//             Progress Dashboard
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-4 mb-6">
//             <Select onValueChange={(v) => setChartType(v)} defaultValue="line">
//               <SelectTrigger className={`w-40 ${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-black/50 border-cyan-500/30 text-cyan-400'}`}>
//                 <SelectValue placeholder="Chart Type" />
//               </SelectTrigger>
//               <SelectContent className={` ${theme === 'custom' ? 'bg-white  text-blue-600' : theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/80 text-cyan-300'}`}>
//                 <SelectItem value="line"
//                 className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Line</SelectItem>
//                 <SelectItem value="curve"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Curve</SelectItem>
//                 <SelectItem value="area"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Area</SelectItem>
//                 <SelectItem value="bar"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Bar</SelectItem>
//                 <SelectItem value="pie"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Pie</SelectItem>
//                 <SelectItem value="radar"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Radar</SelectItem>
//                 <SelectItem value="radial"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Radial</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select onValueChange={(v) => setFilter(v)} defaultValue="daily">
//               <SelectTrigger className={`w-40 ${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-black/50 border-fuchsia-500/30 text-fuchsia-400'}`}>
//                 <SelectValue placeholder="Filter" />
//               </SelectTrigger>
//               <SelectContent className={`${theme === 'custom' ? 'bg-white text-blue-600' : theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/80 text-fuchsia-300'}`}>
//                 <SelectItem value="daily"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Daily</SelectItem>
//                 <SelectItem value="weekly"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Weekly</SelectItem>
//                 <SelectItem value="monthly"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Monthly</SelectItem>
//                 <SelectItem value="yearly"className={cn(
//                             'dropdown-menu-item hover:bg-primary-dark',
//                             theme === 'custom' && 'hover:[color:white]'
//                           )}>Yearly</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {loading ? (
//             <div className="w-full h-[400px] flex items-center justify-center">
//               <Skeleton className={`w-full h-[400px] rounded-xl bg-gradient-to-r ${theme === 'custom' ? 'from-blue-100 to-blue-200' : theme === 'light' ? 'from-gray-100 to-gray-200' : 'from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10'} animate-pulse`} />
//             </div>
//           ) : (
//             <div className="w-full h-[400px] transition-all duration-500 ease-in-out">
//               {renderChart()}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Calendar Section */}
//       <Card className={`bg-white dark:bg-black/40 border ${theme === 'custom' ? 'border-blue-400' : theme === 'light' ? 'border-gray-200' : 'border-cyan-500/30'} shadow-md ${theme === 'dark' ? 'dark:shadow-xl dark:shadow-cyan-500/20' : ''} rounded-2xl`}>
//         <CardHeader>
//           <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${theme === 'custom' ? 'from-blue-400 to-blue-600' : theme === 'light' ? 'from-blue-600 to-indigo-600' : 'from-cyan-400 to-fuchsia-500'} bg-clip-text text-transparent`}>
//             Quiz Activity Calendar
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <Skeleton className={`w-full h-[200px] rounded-xl bg-gradient-to-r ${theme === 'custom' ? 'from-blue-100 to-blue-200' : theme === 'light' ? 'from-gray-100 to-gray-200' : 'from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10'} animate-pulse`} />
//           ) : (
//             <>
//               {/* Year Selection Buttons */}
//               <div className="flex gap-2 mb-4">
//                 {availableYears.map((year) => (
//                   <Button
//                     key={year}
//                     variant={selectedYear === year ? 'default' : 'outline'}
//                     onClick={() => {
//                       setSelectedYear(year)
//                       setSelectedMonth(0) // Reset to January when changing year
//                     }}
//                     className={`${
//                       selectedYear === year
//                         ? theme === 'custom' ? 'bg-blue-400 text-white' : theme === 'light' ? 'bg-blue-500 text-white' : 'bg-cyan-500 text-white'
//                         : theme === 'custom' ? 'bg-white border-blue-400 text-blue-400' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-black/50 border-cyan-500/30 text-cyan-400'
//                     } ${theme === 'custom' ? 'hover:bg-blue-500 text-white' : theme === 'light' ? 'hover:bg-blue-500/80 hover:text-white' : 'hover:bg-cyan-500/80 hover:text-white'}`}
//                   >
//                     {year}
//                   </Button>
//                 ))}
//               </div>

//               {/* Color Key */}
//               <div className="flex items-center gap-2 mb-4">
//                 <span className={`text-sm ${theme === 'custom' ? 'text-gray-700' : theme === 'light' ? 'text-gray-700' : 'text-cyan-300'}`}>Quiz Activity Key:</span>
//                 <div className="flex items-center gap-1 flex-wrap">
//                   {[0, 1, 2, 3, 10].map((count) => (
//                     <div key={count} className="flex items-center gap-1">
//                       <div
//                         className="w-4 h-4 rounded-sm"
//                         style={{ backgroundColor: getColorForCount(count) }}
//                       />
//                       <span className={`text-xs ${theme === 'custom' ? 'text-gray-700' : theme === 'light' ? 'text-gray-700' : 'text-cyan-300'}`}>
//                         {count === 0 ? 'No quizzes' : count === 3 ? '3–9 quizzes' : count === 10 ? '10+ quizzes' : `${count} quiz${count !== 1 ? 'zes' : ''}`}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Month Carousel */}
//               <Carousel
//                 setApi={(api) => {
//                   if (api) {
//                     api.scrollTo(selectedMonth)
//                     api.on('select', () => {
//                       setSelectedMonth(api.selectedScrollSnap())
//                     })
//                   }
//                 }}
//                 className="w-full max-w-md mx-auto"
//               >
//                 <CarouselContent>
//                   {months.map((month) => {
//                     const calendarDays = generateMonthCalendar(selectedYear, month.index)
//                     return (
//                       <CarouselItem key={month.index}>
//                         <div className="p-4">
//                           <h4 className={`text-center mb-2 ${theme === 'custom' ? 'text-gray-900' : theme === 'light' ? 'text-gray-900' : 'text-cyan-300'}`}>
//                             {month.name} {selectedYear}
//                           </h4>
//                           <div className="grid grid-cols-7 gap-1 text-xs">
//                             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                               <div key={day} className={`text-center ${theme === 'custom' ? 'text-gray-900' : theme === 'light' ? 'text-gray-900' : 'text-cyan-300'}`}>
//                                 {day}
//                               </div>
//                             ))}
//                             {calendarDays.map((day, index) => (
//                               <div
//                                 key={index}
//                                 className={`w-8 h-8 flex items-center justify-center rounded-sm ${theme === 'custom' ? 'text-gray-900' : theme === 'light' ? 'text-gray-900' : 'text-white'} ${
//                                   day.date ? 'cursor-pointer' : ''
//                                 } ${day.date === currentDate ? (theme === 'custom' ? 'border-2 border-blue-400' : theme === 'light' ? 'border-2 border-blue-500' : 'border-2 border-cyan-500') : ''}`}
//                                 style={{ backgroundColor: getColorForCount(day.count) }}
//                                 title={day.date ? `${day.date}: ${day.count} quiz${day.count !== 1 ? 'zes' : ''} taken` : ''}
//                               >
//                                 {day.date ? new Date(day.date).getDate() : ''}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </CarouselItem>
//                     )
//                   })}
//                 </CarouselContent>
//                 <CarouselPrevious className={`${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900 hover:bg-blue-500/80 hover:text-white' : 'bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/80 hover:text-black'}`} />
//                 <CarouselNext className={`${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900 hover:bg-blue-500/80 hover:text-white' : 'bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/80 hover:text-black'}`} />
//               </Carousel>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



import ProgressPage from "@/features/progress/progress.module"
import React from "react"
export default function Messages() {
   return( <ProgressPage/>)
}