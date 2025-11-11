// components/ProgressChart.tsx
'use client'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js'
import { Line, Bar, Pie, Radar, Doughnut, PolarArea, Bubble, Scatter } from 'react-chartjs-2'
import { AggregatedData } from '@/lib/types'
import Box from '@/components/ui/box'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

interface ProgressChartProps {
  aggregatedData: AggregatedData
  loading: boolean
  onChartTypeChange: (type: string) => void
  onFilterChange: (filter: string) => void
  chartType: string
  filter: string
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  aggregatedData,
  loading,
  onChartTypeChange,
  onFilterChange,
  chartType,
}) => {
  const { theme } = useTheme()

  // Chart dataset colors per mode
  const chartColors: Record<string, { border: string; background: string | string[] }> = {
    line: { border: theme === 'custom' ? '#60a5fa' : '#2563eb', background: theme === 'custom' ? '#60a5fa33' : '#3b82f633' },
    curve: { border: theme === 'custom' ? '#93c5fd' : '#d946ef', background: theme === 'custom' ? '#93c5fd33' : '#d946ef33' },
    area: { border: theme === 'custom' ? '#60a5fa' : '#0ea5e9', background: theme === 'custom' ? '#60a5fa55' : '#0ea5e955' },
    bar: { border: theme === 'custom' ? '#34d399' : '#10b981', background: theme === 'custom' ? '#34d39999' : '#10b98199' },
    pie: {
      border: '#f59e0b',
      background: theme === 'custom' ? ['#60a5fa', '#93c5fd', '#f59e0b', '#34d399', '#ef4444'] : ['#2563eb', '#d946ef', '#f59e0b', '#10b981', '#ef4444'],
    },
    radar: { border: '#ef4444', background: '#ef444455' },
    radial: {
      border: theme === 'custom' ? '#60a5fa' : '#0ea5e9',
      background: theme === 'custom' ? ['#60a5fa', '#93c5fd', '#f59e0b', '#34d399', '#ef4444', '#7dd3fc'] : ['#2563eb', '#d946ef', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
    },
    
  }

  const chartData = {
    labels: aggregatedData.labels,
    datasets: [
      {
        label: 'Points (𝙐𝙥)',
        data: aggregatedData.dataValues,
        borderColor: chartColors[chartType]?.border,
        backgroundColor: chartColors[chartType]?.background,
        fill: chartType === 'area' || chartType === 'curve',
        tension: chartType === 'curve' ? 0.5 : 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' } },
      tooltip: {
        backgroundColor: theme === 'custom' ? '#f8fafc' : theme === 'light' ? '#ffffff' : '#0f172a',
        borderColor: chartColors[chartType]?.border,
        borderWidth: 1,
        titleColor: chartColors[chartType]?.border,
        bodyColor: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb',
      },
    },
    scales:
      chartType !== 'pie' && chartType !== 'radial' && chartType !== 'radar'
        ? {
            x: {
              ticks: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' },
              grid: { color: theme === 'custom' ? '#e5e7eb' : theme === 'light' ? '#e5e7eb' : '#1e293b' },
            },
            y: {
              ticks: { color: theme === 'custom' ? '#1f2937' : theme === 'light' ? '#1f2937' : '#e5e7eb' },
              grid: { color: theme === 'custom' ? '#e5e7eb' : theme === 'light' ? '#e5e7eb' : '#1e293b' },
            },
          }
        : {},
  }

  const renderChart = () => {
    if (chartType === 'line') return <Line data={chartData} options={options} />
    if (chartType === 'curve') return <Line data={chartData} options={options} />
    if (chartType === 'area') return <Line data={chartData} options={options} />
    if (chartType === 'bar') return <Bar data={chartData} options={options} />
    if (chartType === 'pie') return <Pie data={chartData} options={options} />
    if (chartType === 'radar') return <Radar data={chartData} options={options} />
    if (chartType === 'radial') return <Doughnut data={chartData} options={options} />
    if (chartType === 'polarArea') return <PolarArea data={chartData} options={options} />
    if (chartType === 'bubble') return <Bubble data={chartData} options={options} />
    if (chartType === 'scatter') return <Scatter data={chartData} options={options} />
    return null
  }

  return (
    <Card className={`bg-white dark:bg-black/40 border ${theme === 'custom' ? 'border-blue-400' : theme === 'light' ? 'border-gray-200' : 'border-cyan-500/30'} shadow-md ${theme === 'dark' ? 'dark:shadow-xl dark:shadow-cyan-500/20' : ''} rounded-2xl mb-4 sm:mb-8`}>
      <CardHeader>
        <CardTitle className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${theme === 'custom' ? 'from-blue-400 to-blue-600' : theme === 'light' ? 'from-blue-600 to-indigo-600' : 'from-cyan-400 to-fuchsia-500'} bg-clip-text text-transparent`}>
          Progress Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Box as="div" className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Select onValueChange={onChartTypeChange} defaultValue="line">
            <SelectTrigger className={`w-full sm:w-40 ${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-black/50 border-cyan-500/30 text-cyan-400'}`}>
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent className={` ${theme === 'custom' ? 'bg-white  text-blue-600' : theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/80 text-cyan-300'}`}>
              <SelectItem value="line" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Line</SelectItem>
              <SelectItem value="curve" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Curve</SelectItem>
              <SelectItem value="area" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Area</SelectItem>
              <SelectItem value="bar" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Bar</SelectItem>
              <SelectItem value="pie" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Pie</SelectItem>
              <SelectItem value="radar" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Radar</SelectItem>
              <SelectItem value="radial" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Radial</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onFilterChange} defaultValue="daily">
            <SelectTrigger className={`w-full sm:w-40 ${theme === 'custom' ? 'bg-white border-blue-400 text-blue-400' : theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-black/50 border-fuchsia-500/30 text-fuchsia-400'}`}>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className={`${theme === 'custom' ? 'bg-white text-blue-600' : theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/80 text-fuchsia-300'}`}>
              <SelectItem value="daily" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Daily</SelectItem>
              <SelectItem value="weekly" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Weekly</SelectItem>
              <SelectItem value="monthly" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Monthly</SelectItem>
              <SelectItem value="yearly" className={cn('dropdown-menu-item hover:bg-primary-dark', theme === 'custom' && 'hover:[color:white]')}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </Box>

        {loading ? (
          <Box as="div" className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
            <Skeleton className={`w-full h-full rounded-xl bg-gradient-to-r ${theme === 'custom' ? 'from-blue-100 to-blue-200' : theme === 'light' ? 'from-gray-100 to-gray-200' : 'from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10'} animate-pulse`} />
          </Box>
        ) : (
          <Box as="div" className="w-full h-[500px] sm:h-[400px] transition-all duration-500 ease-in-out">
            {renderChart()}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
