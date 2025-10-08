"use client"

import { useState, useEffect } from "react"
import {
    getAdminAnalytics,
    getDonationTrends,
    getUserGrowth,
    getCauseCategories,
    type AnalyticsData,
    type DonationTrend,
    type UserGrowth,
    type CauseCategory
} from "@/actions/admin-analytics-actions"

interface UseAdminAnalyticsReturn {
    data: AnalyticsData | null
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
}

interface UseAnalyticsChartsReturn {
    donationTrends: DonationTrend[]
    userGrowth: UserGrowth[]
    causeCategories: CauseCategory[]
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
}

/**
 * Hook for fetching admin analytics data
 */
export function useAdminAnalytics(): UseAdminAnalyticsReturn {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const analyticsData = await getAdminAnalytics()
            setData(analyticsData)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
            console.error("Error fetching admin analytics:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    }
}

/**
 * Hook for fetching analytics charts data
 */
export function useAnalyticsCharts(): UseAnalyticsChartsReturn {
    const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([])
    const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([])
    const [causeCategories, setCauseCategories] = useState<CauseCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const [trends, growth, categories] = await Promise.all([
                getDonationTrends(),
                getUserGrowth(),
                getCauseCategories()
            ])

            setDonationTrends(trends)
            setUserGrowth(growth)
            setCauseCategories(categories)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch charts data")
            console.error("Error fetching analytics charts:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return {
        donationTrends,
        userGrowth,
        causeCategories,
        isLoading,
        error,
        refetch: fetchData
    }
} 