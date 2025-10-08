"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts"
import { Inbox } from "lucide-react"

interface SignatureTrendsProps {
  data: Array<{
    date: string
    amount: number
  }>
}

export function SignatureTrends({ data }: SignatureTrendsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Signature Trends</CardTitle>
          <CardDescription>Track your petition's signature patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Inbox className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No signature data available</p>
            <p className="text-sm">Start receiving signatures to see trends</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature Trends</CardTitle>
        <CardDescription>Track your petition's signature patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Signatures",
              color: "#2563eb", // Light mode color
            }
          }}
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            {/* Tooltip now uses your shared chart styling */}
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-amount)" // Uses CSS variable from ChartContainer
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
