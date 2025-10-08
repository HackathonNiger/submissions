"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Block a user
 */
export async function blockUser(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Update the profile to mark the user as blocked
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    is_blocked: true,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error blocking user:", error);
    return false;
  }

  revalidatePath("/dashboard/admin/users");
  return true;
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Update the profile to mark the user as not blocked
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    is_blocked: false,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error unblocking user:", error);
    return false;
  }

  revalidatePath("/dashboard/admin/users");
  return true;
}

/**
 * Check if a user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Get the profile to check if the user is blocked
  const { data, error } = await supabase
    .from("profiles")
    .select("is_blocked")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking if user is blocked:", error);
    return false;
  }

  return data?.is_blocked || false;
}

export async function deleteUserAccount(
  userId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Not authenticated" };
    }

    // Ensure user can only delete their own account
    if (user.id !== userId) {
      return { error: "You can only delete your own account" };
    }

    // Delete user's KYC verifications first
    const { error: kycError } = await supabase
      .from("kyc_verifications")
      .delete()
      .eq("user_id", userId);

    if (kycError) {
      console.error("Error deleting KYC verifications:", kycError);
      return { error: kycError.message };
    }

    // Delete user's roles
    const { error: roleError } = await supabase
      .from("roles")
      .delete()
      .eq("user_id", userId);

    if (roleError) {
      console.error("Error deleting user roles:", roleError);
      return { error: roleError.message };
    }

    // Delete user's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return { error: profileError.message };
    }

    // Delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Error deleting auth user:", authError);
      return { error: authError.message };
    }

    revalidatePath("/dashboard/settings");
    return { error: null };
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}
