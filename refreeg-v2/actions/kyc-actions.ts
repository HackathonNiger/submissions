"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { KycVerification, KycStatus } from "@/types/kyc-types";
import {
  sendKycSubmittedEmail,
  sendKycApprovedEmail,
  sendKycRejectedEmail,
} from "@/services/mail";

export async function uploadKycDocument(
  userId: string,
  file: File,
  documentType: string,
  personalData: {
    fullName: string;
    dob: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  }
): Promise<{ documentUrl: string; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check for existing KYC
    const { data: existingKyc } = await supabase
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingKyc) {
      if (existingKyc.status === "approved") {
        return { documentUrl: "", error: "You are already verified." };
      }
      // Update the existing record (for pending or rejected)
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const bucket = "kyc-documents";

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return {
          documentUrl: "",
          error: "Invalid file type. Please upload a JPEG, PNG, or PDF file.",
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          documentUrl: "",
          error: "File size too large. Maximum size is 5MB.",
        };
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        return { documentUrl: "", error: uploadError.message };
      }

      // Get permanent public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        return { documentUrl: "", error: "Failed to get public URL" };
      }

      const { error: updateError } = await supabase
        .from("kyc_verifications")
        .update({
          document_type: documentType,
          // Store only the storage path; UI will derive public URL
          document_url: fileName,
          status: "pending",
          verification_notes: "Resubmitted for review",
          full_name: personalData.fullName,
          dob: personalData.dob,
          phone: personalData.phone,
          address: personalData.address,
          city: personalData.city,
          state: personalData.state,
          postal: personalData.postal,
          country: personalData.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingKyc.id);

      if (updateError) {
        return { documentUrl: "", error: updateError.message };
      }

      // Send email notification for resubmission
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        if (profile?.email) {
          await sendKycSubmittedEmail(profile.email, personalData.fullName);
        }
      } catch (emailError) {
        console.error("Error sending KYC submission email:", emailError);
        // Don't fail the KYC submission if email fails
      }

      return { documentUrl: urlData.publicUrl, error: null };
    } else {
      // Insert new record
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const bucket = "kyc-documents";

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return {
          documentUrl: "",
          error: "Invalid file type. Please upload a JPEG, PNG, or PDF file.",
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          documentUrl: "",
          error: "File size too large. Maximum size is 5MB.",
        };
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        return { documentUrl: "", error: uploadError.message };
      }

      // Get permanent public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        return { documentUrl: "", error: "Failed to get public URL" };
      }

      const { error: insertError } = await supabase
        .from("kyc_verifications")
        .insert({
          user_id: userId,
          document_type: documentType,
          // Store only the storage path; UI will derive public URL
          document_url: fileName,
          status: "pending",
          verification_notes: "Awaiting admin review",
          full_name: personalData.fullName,
          dob: personalData.dob,
          phone: personalData.phone,
          address: personalData.address,
          city: personalData.city,
          state: personalData.state,
          postal: personalData.postal,
          country: personalData.country,
        });

      if (insertError) {
        return { documentUrl: "", error: insertError.message };
      }

      // Send email notification for new submission
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        if (profile?.email) {
          await sendKycSubmittedEmail(profile.email, personalData.fullName);
        }
      } catch (emailError) {
        console.error("Error sending KYC submission email:", emailError);
        // Don't fail the KYC submission if email fails
      }

      return { documentUrl: urlData.publicUrl, error: null };
    }
  } catch (error) {
    console.error("Error in uploadKycDocument:", error);
    return { documentUrl: "", error: "Failed to process document" };
  }
}

export async function getVerificationStatus(
  userId: string
): Promise<{ status: KycVerification | null; error: string | null }> {
  try {
    const supabase = await createClient();
    console.log("Fetching KYC for user:", userId);
    const { data, error } = await supabase
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(); // ✅ Handles 0 or 1 result gracefully

    if (error) {
      throw error;
    }

    // If we have a record, map storage path to permanent public URL for UI consumption
    if (data?.document_url) {
      const { data: publicData } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(data.document_url);
      if (publicData?.publicUrl) {
        (data as any).document_url = publicData.publicUrl;
      }
    }

    return { status: data, error: null };
  } catch (error) {
    console.error("Error getting verification status:", JSON.stringify(error));
    return {
      status: null,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : JSON.stringify(error) || "Failed to get status",
    };
  }
}

// Admin function to update verification status
export async function updateVerificationStatus(
  verificationId: string,
  status: "approved" | "rejected",
  notes?: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();
    console.log(
      "[KYC] Updating status for verificationId:",
      verificationId,
      "to status:",
      status
    );
    // Update KYC status
    const { error: updateError } = await supabase
      .from("kyc_verifications")
      .update({
        status: status,
        verification_notes:
          notes ||
          (status === "approved" ? "Approved by admin" : "Rejected by admin"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", verificationId);

    if (updateError) {
      console.error("[KYC] Error updating KYC status:", updateError);
      return { error: updateError.message || JSON.stringify(updateError) };
    }

    // Get the user_id from the verification record
    const { data: verification, error: fetchError } = await supabase
      .from("kyc_verifications")
      .select("user_id, full_name")
      .eq("id", verificationId)
      .single();

    if (fetchError) {
      console.error(
        "[KYC] Error fetching verification record after update:",
        fetchError
      );
      return { error: fetchError.message || JSON.stringify(fetchError) };
    }

    if (verification) {
      // Send email notification based on status
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", verification.user_id)
          .single();

        if (profile?.email) {
          if (status === "approved") {
            await sendKycApprovedEmail(
              profile.email,
              verification.full_name || "User"
            );
          } else if (status === "rejected") {
            await sendKycRejectedEmail(
              profile.email,
              verification.full_name || "User",
              notes ||
                "Your KYC verification was rejected. Please review and resubmit."
            );
          }
        }
      } catch (emailError) {
        console.error("Error sending KYC status email:", emailError);
        // Don't fail the status update if email fails
      }

      if (status === "approved") {
        // Update user profile to mark as verified
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("id", verification.user_id);

        if (profileError) {
          console.error(
            "[KYC] Error updating user profile to verified:",
            profileError
          );
          return {
            error: profileError.message || JSON.stringify(profileError),
          };
        }
      } else if (status === "rejected") {
        // Remove verified status from user profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ is_verified: false })
          .eq("id", verification.user_id);

        if (profileError) {
          console.error(
            "[KYC] Error updating user profile to unverified:",
            profileError
          );
          return {
            error: profileError.message || JSON.stringify(profileError),
          };
        }
      }
    } else {
      console.error(
        "[KYC] No verification record found for id:",
        verificationId
      );
      return { error: "No verification record found for this id." };
    }

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/settings");
    return { error: null };
  } catch (error) {
    console.error("[KYC] Unhandled error in updateVerificationStatus:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to update status",
    };
  }
}
