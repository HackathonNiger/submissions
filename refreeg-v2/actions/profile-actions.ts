"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Profile, ProfileFormData, BankDetailsFormData } from "@/types";

/**
 * Get a user's profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data as Profile;
}

/**
 * Check if a user has bank details
 */
export async function hasBankDetails(userId: string): Promise<boolean> {
  const profile = await getProfile(userId);
  return !!(profile && profile.account_number && profile.bank_name);
}

/**
 * Update a user's profile
 */
export async function updateProfile(
  userId: string,
  profileData: ProfileFormData
): Promise<Profile> {
  const supabase = await createClient();

  const updateData = {
    id: userId,
    full_name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    bio: profileData.bio,
    profile_photo: profileData.profile_photo,
    twitter_url: profileData.twitter_url || null,
    facebook_url: profileData.facebook_url || null,
    instagram_url: profileData.instagram_url || null,
    linkedin_url: profileData.linkedin_url || null,
    updated_at: new Date().toISOString(),
  };

  console.log("Updating profile with data:", updateData);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(updateData)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  revalidatePath("/dashboard/settings");
  revalidatePath(`/profile/${userId}`);
  revalidatePath("/");

  return data as Profile;
}

/**
 * Update a user's profile photo
 */
export async function updateProfilePhoto(
  userId: string,
  photoFile: File
): Promise<string> {
  const supabase = await createClient();

  const fileName = `${userId}-${Date.now()}-${photoFile.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, photoFile, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading profile photo:", uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(fileName);

  const publicUrl = urlData.publicUrl;

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      profile_photo: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile with photo URL:", error);
    throw error;
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  return publicUrl;
}

/**
 * Update a user's bank details
 */
export async function updateBankDetails(
  userId: string,
  bankData: BankDetailsFormData
): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      account_number: bankData.accountNumber,
      bank_name: bankData.bankName,
      account_name: bankData.accountName,
      sub_account_code: bankData.sub_account_code,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating bank details:", error);
    throw error;
  }

  revalidatePath("/dashboard/settings");
  return data as Profile;
}

/**
 * Check if profile is complete
 */
export async function isProfileComplete(
  userId: string
): Promise<{ isComplete: boolean; missingFields: string[] }> {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("full_name, bio, profile_photo")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile for completion check:", error);
      return { isComplete: false, missingFields: ["profile"] };
    }

    const missingFields: string[] = [];

    if (!profile?.full_name || profile.full_name.trim() === "") {
      missingFields.push("full name");
    }

    if (!profile?.bio || profile.bio.trim() === "") {
      missingFields.push("bio");
    }

    if (!profile?.profile_photo) {
      missingFields.push("profile picture");
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  } catch (error) {
    console.error("Error in isProfileComplete:", error);
    return { isComplete: false, missingFields: ["profile"] };
  }
}

/* ------------------------------------------------------------------
   KYC ACTIONS
------------------------------------------------------------------ */

/**
 * Check if a user has a KYC verification
 */
export async function hasKycVerification(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kyc_verifications")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;

  // Map storage path in document_url to public URL for consumers
  if (data.document_url) {
    const { data: urlData } = supabase.storage
      .from("kyc-documents")
      .getPublicUrl(data.document_url);
    if (urlData?.publicUrl) {
      (data as any).document_url = urlData.publicUrl;
    }
  }

  return data;
}

/**
 * Update a KYC verification status
 */
export async function updateKycStatus(
  verificationId: string,
  status: "approved" | "rejected",
  notes?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kyc_verifications")
    .update({
      status,
      verification_notes: notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", verificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
