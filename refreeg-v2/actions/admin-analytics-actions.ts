"use server"

import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"

export interface AnalyticsData {
    totalDonations: {
        current: string
        previous: string
        percentageChange: string
    }
    totalUsers: {
        current: number
        previous: number
        percentageChange: string
    }
    activeCauses: {
        current: number
        previous: number
        percentageChange: string
    }
    pendingApprovals: {
        current: number
        previous: number
        percentageChange: string
    }
}

export interface DonationTrend {
    month: string
    amount: number
}

export interface UserGrowth {
    month: string
    users: number
}

export interface CauseCategory {
    category: string
    count: number
}

/**
 * Get admin analytics data with current and previous period comparisons
 */
export async function getAdminAnalytics(): Promise<AnalyticsData> {
    const supabase = await createClient()

    // Get current date and calculate previous month ranges
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    try {
        // Fetch current month donations (both regular and crypto)
        const [
            currentDonationsResult,
            previousDonationsResult,
            currentCryptoDonationsResult,
            previousCryptoDonationsResult,
            currentUsersResult,
            previousUsersResult,
            currentCausesResult,
            previousCausesResult,
            currentPendingResult,
            previousPendingResult
        ] = await Promise.all([
            // Current month regular donations
            supabase
                .from("donations")
                .select("amount")
                .gte("created_at", currentMonthStart.toISOString())
                .eq("status", "completed"),

            // Previous month regular donations
            supabase
                .from("donations")
                .select("amount")
                .gte("created_at", previousMonthStart.toISOString())
                .lt("created_at", currentMonthStart.toISOString())
                .eq("status", "completed"),

            // Current month crypto donations
            supabase
                .from("crypto_donations")
                .select("amount_in_naira")
                .gte("created_at", currentMonthStart.toISOString())
                .eq("status", "completed"),

            // Previous month crypto donations
            supabase
                .from("crypto_donations")
                .select("amount_in_naira")
                .gte("created_at", previousMonthStart.toISOString())
                .lt("created_at", currentMonthStart.toISOString())
                .eq("status", "completed"),

            // Current month users
            supabase
                .from("profiles")
                .select("id", { count: "exact" })
                .gte("created_at", currentMonthStart.toISOString()),

            // Previous month users
            supabase
                .from("profiles")
                .select("id", { count: "exact" })
                .gte("created_at", previousMonthStart.toISOString())
                .lt("created_at", currentMonthStart.toISOString()),

            // Current active causes
            supabase
                .from("causes")
                .select("id", { count: "exact" })
                .eq("status", "approved"),

            // Previous month active causes
            supabase
                .from("causes")
                .select("id", { count: "exact" })
                .eq("status", "approved")
                .lt("created_at", currentMonthStart.toISOString()),

            // Current pending approvals
            supabase
                .from("causes")
                .select("id", { count: "exact" })
                .eq("status", "pending"),

            // Previous pending approvals
            supabase
                .from("causes")
                .select("id", { count: "exact" })
                .eq("status", "pending")
                .lt("created_at", currentMonthStart.toISOString())
        ])

        // Calculate total donations (regular + crypto)
        const currentRegularTotal = currentDonationsResult.data?.reduce((sum, d) => sum + d.amount, 0) || 0
        const currentCryptoTotal = currentCryptoDonationsResult.data?.reduce((sum, d) => sum + (d.amount_in_naira || 0), 0) || 0
        const currentTotalDonations = currentRegularTotal + currentCryptoTotal

        const previousRegularTotal = previousDonationsResult.data?.reduce((sum, d) => sum + d.amount, 0) || 0
        const previousCryptoTotal = previousCryptoDonationsResult.data?.reduce((sum, d) => sum + (d.amount_in_naira || 0), 0) || 0
        const previousTotalDonations = previousRegularTotal + previousCryptoTotal

        // Calculate percentage changes
        const donationPercentageChange = previousTotalDonations > 0
            ? ((currentTotalDonations - previousTotalDonations) / previousTotalDonations * 100).toFixed(1)
            : "100.0"

        const userPercentageChange = (previousUsersResult.count || 0) > 0
            ? (((currentUsersResult.count || 0) - (previousUsersResult.count || 0)) / (previousUsersResult.count || 0) * 100).toFixed(1)
            : "100.0"

        const causePercentageChange = (previousCausesResult.count || 0) > 0
            ? (((currentCausesResult.count || 0) - (previousCausesResult.count || 0)) / (previousCausesResult.count || 0) * 100).toFixed(1)
            : "100.0"

        const pendingPercentageChange = (previousPendingResult.count || 0) > 0
            ? (((currentPendingResult.count || 0) - (previousPendingResult.count || 0)) / (previousPendingResult.count || 0) * 100).toFixed(1)
            : ((currentPendingResult.count || 0) > 0 ? "100.0" : "0.0")

        return {
            totalDonations: {
                current: formatCurrency(currentTotalDonations),
                previous: formatCurrency(previousTotalDonations),
                percentageChange: `${parseFloat(donationPercentageChange) >= 0 ? '+' : ''}${donationPercentageChange}% from last month`
            },
            totalUsers: {
                current: currentUsersResult.count || 0,
                previous: previousUsersResult.count || 0,
                percentageChange: `${parseFloat(userPercentageChange) >= 0 ? '+' : ''}${userPercentageChange}% from last month`
            },
            activeCauses: {
                current: currentCausesResult.count || 0,
                previous: previousCausesResult.count || 0,
                percentageChange: `${parseFloat(causePercentageChange) >= 0 ? '+' : ''}${causePercentageChange}% from last month`
            },
            pendingApprovals: {
                current: currentPendingResult.count || 0,
                previous: previousPendingResult.count || 0,
                percentageChange: `${parseFloat(pendingPercentageChange) >= 0 ? '+' : ''}${pendingPercentageChange} from last month`
            }
        }
    } catch (error) {
        console.error("Error fetching admin analytics:", error)
        throw error
    }
}

/**
 * Get donation trends over the last 12 months
 */
export async function getDonationTrends(): Promise<DonationTrend[]> {
    const supabase = await createClient()

    try {
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

        const [regularDonations, cryptoDonations] = await Promise.all([
            supabase
                .from("donations")
                .select("amount, created_at")
                .gte("created_at", twelveMonthsAgo.toISOString())
                .eq("status", "completed"),

            supabase
                .from("crypto_donations")
                .select("amount_in_naira, created_at")
                .gte("created_at", twelveMonthsAgo.toISOString())
                .eq("status", "completed")
        ])

        // Combine and group by month
        const monthlyData: Record<string, number> = {}

        // Process regular donations
        regularDonations.data?.forEach(donation => {
            const date = new Date(donation.created_at)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + donation.amount
        })

        // Process crypto donations
        cryptoDonations.data?.forEach(donation => {
            const date = new Date(donation.created_at)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (donation.amount_in_naira || 0)
        })

        // Convert to array and sort
        return Object.entries(monthlyData)
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month))
    } catch (error) {
        console.error("Error fetching donation trends:", error)
        throw error
    }
}

/**
 * Get user growth trends over the last 12 months
 */
export async function getUserGrowth(): Promise<UserGrowth[]> {
    const supabase = await createClient()

    try {
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

        const { data: users, error } = await supabase
            .from("profiles")
            .select("created_at")
            .gte("created_at", twelveMonthsAgo.toISOString())

        if (error) throw error

        // Group by month
        const monthlyGrowth: Record<string, number> = {}

        users?.forEach(user => {
            const date = new Date(user.created_at)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1
        })

        return Object.entries(monthlyGrowth)
            .map(([month, users]) => ({ month, users }))
            .sort((a, b) => a.month.localeCompare(b.month))
    } catch (error) {
        console.error("Error fetching user growth:", error)
        throw error
    }
}

/**
 * Get cause categories distribution
 */
export async function getCauseCategories(): Promise<CauseCategory[]> {
    const supabase = await createClient()

    try {
        const { data: causes, error } = await supabase
            .from("causes")
            .select("category")
            .eq("status", "approved")

        if (error) throw error

        // Group by category
        const categoryCount: Record<string, number> = {}

        causes?.forEach(cause => {
            categoryCount[cause.category] = (categoryCount[cause.category] || 0) + 1
        })

        return Object.entries(categoryCount)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
    } catch (error) {
        console.error("Error fetching cause categories:", error)
        throw error
    }
} 