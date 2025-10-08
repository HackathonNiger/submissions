"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    // console.error("Error getting current user:", error)
    return null
  }

  return user
}

