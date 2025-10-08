"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EngagementMetricsProps {
    shares: number
    comments: number
    views: number
    conversionRate: number
}

export function EngagementMetrics({ shares, comments, views, conversionRate }: EngagementMetricsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Track how people interact with your cause</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{shares}</div>
                        <p className="text-sm text-muted-foreground">Shares</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{comments}</div>
                        <p className="text-sm text-muted-foreground">Comments</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{views}</div>
                        <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 

export function PetitionEngagementMetrics({ shares, comments, views, conversionRate }: EngagementMetricsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Track how people interact with your cause</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{shares}</div>
                        <p className="text-sm text-muted-foreground">Shares</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{comments}</div>
                        <p className="text-sm text-muted-foreground">Comments</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{views}</div>
                        <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 