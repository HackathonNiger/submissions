"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const performanceData = [
  { week: "Week 1", mathematics: 65, science: 70, english: 75, history: 68 },
  { week: "Week 2", mathematics: 68, science: 73, english: 78, history: 72 },
  { week: "Week 3", mathematics: 72, science: 76, english: 80, history: 75 },
  { week: "Week 4", mathematics: 75, science: 78, english: 82, history: 78 },
  { week: "Week 5", mathematics: 78, science: 82, english: 85, history: 80 },
  { week: "Week 6", mathematics: 82, science: 85, english: 87, history: 83 },
]

const subjectProgress = [
  { subject: "Mathematics", current: 82, target: 90, improvement: 17 },
  { subject: "Science", current: 85, target: 88, improvement: 15 },
  { subject: "English", current: 87, target: 90, improvement: 12 },
  { subject: "History", current: 83, target: 85, improvement: 15 },
]

export function PerformanceChart() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Your progress across all subjects over the past 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[60, 90]} />
              <Tooltip />
              <Line type="monotone" dataKey="mathematics" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="science" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="english" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="history" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Progress vs Targets</CardTitle>
          <CardDescription>Current performance compared to personalized learning targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectProgress} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="subject" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="current" fill="#3b82f6" />
              <Bar dataKey="target" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
