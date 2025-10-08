"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Donation, DonationWithCause, DonationFormData } from "@/types"

/**
 * Create a new donation
 */
export async function createDonation(
  causeId: string,
  userId: string | null,
  donationData: DonationFormData,
): Promise<Donation> {
  const supabase = await createClient()


  const { data, error } = await supabase
    .from("donations")
    .insert({
      cause_id: causeId,
      ...(userId ? { user_id: userId } : {}),
      amount: typeof donationData.amount === "string" ? Number.parseFloat(donationData.amount) : donationData.amount,
      name: String(donationData.isAnonymous).toLocaleLowerCase() === "true" ? "Anonymous" : donationData.name,
      email: donationData.email,
      message: donationData.message || null,
      is_anonymous: donationData.isAnonymous,
      status: "completed", // For now, all donations are immediately completed
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating donation:", error)
    throw error
  }

  revalidatePath(`/causes/${causeId}`)
  revalidatePath('/causes')
  revalidatePath('/')
  if (userId) {
    revalidatePath("/dashboard/donations")
  }

  return data as Donation
}

/**
 * List donations for a cause
 */
export async function listDonationsForCause(causeId: string): Promise<Donation[]> {
  const supabase = await createClient()


  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("cause_id", causeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing donations:", error)
    throw error
  }

  return data as Donation[]
}

/**
 * List donations for a user
 */
export async function listUserDonations(
  userId: string,
  timeframe: "all" | "recent" = "all",
): Promise<DonationWithCause[]> {
  const supabase = await createClient()


  let query = supabase
    .from("donations")
    .select(`
      *,
      causes:cause_id (
        title,
        category
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (timeframe === "recent") {
    // Get donations from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    query = query.gte("created_at", thirtyDaysAgo.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing user donations:", error)
    throw error
  }

  // Transform the response to match our DonationWithCause type
  return data.map((item) => ({
    ...item,
    cause: {
      title: item.causes?.title || "Unknown Cause",
      category: item.causes?.category || "Unknown",
    },
  })) as DonationWithCause[]
}

