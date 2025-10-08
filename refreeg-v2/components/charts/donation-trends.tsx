"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts"
import { Inbox } from "lucide-react"

interface DonationTrendsProps {
    data: Array<{
        date: string
        amount: number
    }>
}

export function DonationTrends({ data }: DonationTrendsProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Donation Trends</CardTitle>
                    <CardDescription>Track your cause's donation patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <Inbox className="w-12 h-12 mb-4" />
                        <p className="text-lg font-medium">No donation data available</p>
                        <p className="text-sm">Start receiving donations to see trends</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Track your cause's donation patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{
                    amount: { label: "Amount", color: "#2563eb" }
                }}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
} 