"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Cause,
  CauseWithUser,
  CauseFormData,
  CauseFilterOptions,
} from "@/types";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-actions";

/**
 * Get a cause by ID
 */
export async function getCause(causeId: string): Promise<CauseWithUser | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("causes")
    .select(
      `
      *,
      profiles!inner (
        full_name,
        email,
        sub_account_code,
        profile_photo
      ),
      cause_sections (
        id,
        heading,
        description
      )
    `
    )
    .eq("id", causeId)
    .single();

  if (
    (data?.status === "pending" || data?.status === "rejected") &&
    user?.id !== data?.user_id
  ) {
    redirect("/");
    return null;
  }
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching cause:", error);
    throw error;
  }

  // Transform the response to match our CauseWithUser type
  const cause = {
    ...data,
    user: {
      name: data.profiles?.full_name || "Anonymous",
      email: data.profiles?.email || "",
      sub_account_code: data.profiles?.sub_account_code || "",
      profile_photo: data.profiles?.profile_photo || null,
    },
    sections: data.cause_sections || [],
    multimedia: data.multimedia || [],
    video_links: data.video_links || [],
  } as unknown as CauseWithUser;

  // Remove the nested objects that we've flattened
  delete (cause as any).profiles;
  delete (cause as any).cause_sections;

  return cause;
}

/**
 * Upload an image to Supabase storage
 */
async function uploadImageToSupabase(
  file: File,
  userId: string,
  type: "cover" | "additional"
): Promise<string> {
  const supabase = await createClient();

  // Generate a unique filename and sanitize it by removing special characters
  const sanitizedOriginalName = file.name.replace(/[^\w\s.-]/g, "_");
  const fileName = `${userId}-${Date.now()}-${type}-${sanitizedOriginalName}`;

  // Choose the appropriate storage bucket based on the file type
  const bucket = file.type.startsWith("video/")
    ? "cause-videos"
    : "profile-photos";

  console.log("bucket", bucket);

  // Upload the file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

/**
 * Create a new cause
 */
export async function createCause(
  userId: string,
  causeData: CauseFormData
): Promise<Cause> {
  const supabase = await createClient();

  // Upload cover image if provided
  let coverImageUrl = null;
  if (causeData.coverImage) {
    coverImageUrl = await uploadImageToSupabase(
      causeData.coverImage,
      userId,
      "cover"
    );
  }

  console.log("Uploaded");

  // Calculate days_active from start and end dates
  let daysActive = null;
  if (causeData.startDate && causeData.endDate) {
    // Ensure we have valid Date objects
    const startDate =
      causeData.startDate instanceof Date
        ? causeData.startDate
        : new Date(causeData.startDate);
    const endDate =
      causeData.endDate instanceof Date
        ? causeData.endDate
        : new Date(causeData.endDate);

    // Validate that the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format provided");
    }

    daysActive = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Upload multimedia files if they exist
  let multimediaUrls: string[] = [];
  if (
    causeData.multimedia &&
    Array.isArray(causeData.multimedia) &&
    causeData.multimedia.length > 0
  ) {
    try {
      multimediaUrls = await Promise.all(
        causeData.multimedia.map((file) =>
          uploadImageToSupabase(file, userId, "additional")
        )
      );
    } catch (error) {
      console.error("Error uploading multimedia:", error);
      throw error;
    }
  }

  // Start a transaction
  const { data: cause, error: causeError } = await supabase
    .from("causes")
    .insert({
      user_id: userId,
      title: causeData.title,
      // description: causeData.description, // <-- ensure this is included
      category: causeData.category,
      goal:
        typeof causeData.goal === "string"
          ? Number.parseFloat(causeData.goal)
          : causeData.goal,
      status: "pending", // All causes start as pending
      image: coverImageUrl, // Store the cover image URL
      days_active: daysActive, // Store the calculated days active
      multimedia: multimediaUrls, // Store image URLs as JSON array
      video_links: causeData.video_links || [],
    })
    .select()
    .single();
  console.log(cause);
  if (causeError) {
    console.error("Error creating cause:", causeError);
    throw causeError;
  }

  // Insert sections if they exist
  if (causeData.sections && causeData.sections.length > 0) {
    const sections = causeData.sections.map((section) => ({
      cause_id: cause.id,
      heading: section.heading,
      description: section.description,
    }));

    const { error: sectionsError } = await supabase
      .from("cause_sections")
      .insert(sections);

    if (sectionsError) {
      console.error("Error creating sections:", sectionsError);
      throw sectionsError;
    }
  }

  revalidatePath("/dashboard/causes");
  return cause as Cause;
}

/**
 * Submit a cause edit request (goes into cause_edits table)
 */
export async function updateCause(
  causeId: string,
  userId: string,
  causeData: Partial<CauseFormData>
): Promise<any> {
  const supabase = await createClient();

  let coverImageUrl = causeData.coverImage
    ? await uploadImageToSupabase(causeData.coverImage, userId, "cover")
    : causeData.image || null;

  // Calculate days_active if dates are provided
  let daysActive = null;
  if (causeData.startDate && causeData.endDate) {
    const startDate =
      causeData.startDate instanceof Date
        ? causeData.startDate
        : new Date(causeData.startDate);
    const endDate =
      causeData.endDate instanceof Date
        ? causeData.endDate
        : new Date(causeData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format provided");
    }

    daysActive = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Upload multimedia files if they exist
  let multimediaUrls: string[] = [];
  if (
    causeData.multimedia &&
    Array.isArray(causeData.multimedia) &&
    causeData.multimedia.length > 0
  ) {
    try {
      multimediaUrls = await Promise.all(
        causeData.multimedia.map((file) =>
          uploadImageToSupabase(file, userId, "additional")
        )
      );
    } catch (error) {
      console.error("Error uploading multimedia:", error);
      throw error;
    }
  }

  // Prepare the edit row for cause_edits
  const editData: any = {
    original_cause_id: causeId,
    user_id: userId,
    title: causeData.title,
    category: causeData.category,
    goal:
      typeof causeData.goal === "string"
        ? Number.parseFloat(causeData.goal)
        : causeData.goal,
    image: coverImageUrl,
    days_active: daysActive,
    multimedia: multimediaUrls.length > 0 ? multimediaUrls : [],
    video_links: causeData.video_links || [],
    status: "pending",
  };

  const { data, error } = await supabase
    .from("cause_edits")
    .insert(editData)
    .select()
    .single();

  if (error) {
    console.error("Error saving cause edit:", error);
    throw error;
  }

  // Insert sections if they exist
  if (causeData.sections && causeData.sections.length > 0) {
    const sections = causeData.sections.map((section) => ({
      cause_edit_id: data.id,
      heading: section.heading,
      description: section.description,
    }));

    const { error: sectionsError } = await supabase
      .from("cause_edit_sections")
      .insert(sections);

    if (sectionsError) {
      console.error("Error creating cause edit sections:", sectionsError);
      throw sectionsError;
    }
  }

  revalidatePath("/dashboard/causes");
  return data;
}

/**
 * List causes with filtering options
 */
export async function listCauses(
  options: CauseFilterOptions = {}
): Promise<Cause[]> {
  const supabase = await createClient();

  let query = supabase
    .from("causes")
    .select("*,profiles(full_name,email,profile_photo)")
    .order("created_at", { ascending: false });

  // Apply filters
  if (options.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options.status) {
    query = query.eq("status", options.status);
  } else {
    // Default to approved causes for public listing
    if (!options.userId) {
      query = query.eq("status", "approved");
    }
  }

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error listing causes:", error);
    throw error;
  }

  const causes = (data as Cause[]) || [];

  // Auto-mark expired (days_active <= 0) and filter from public listings
  const nowExpired = causes.filter(
    (c) => (c.days_active ?? 0) <= 0 && c.status === ("approved" as any)
  );

  if (nowExpired.length > 0) {
    try {
      // Update status to expired in DB for those items
      const ids = nowExpired.map((c) => c.id);
      await supabase
        .from("causes")
        .update({ status: "expired" })
        .in("id", ids);
    } catch (e) {
      console.error("Failed to auto-expire causes:", e);
    }
  }

  const isOwnerScoped = !!options.userId; // owner dashboard should still see their items
  const result = isOwnerScoped
    ? causes
    : causes.filter((c) => c.status !== ("expired" as any));

  return result;
}

/**
 * Count causes with filtering options
 */
export async function countCauses(
  options: CauseFilterOptions = {}
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("causes")
    .select("id", { count: "exact", head: true });

  // Apply filters
  if (options.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options.status) {
    query = query.eq("status", options.status);
  } else {
    // Default to approved causes for public listing
    if (!options.userId) {
      query = query.eq("status", "approved");
    }
  }

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting causes:", error);
    throw error;
  }

  return count || 0;
}

/**
 * Approve or reject a cause (admin function)
 */
export async function updateCauseStatus(
  causeId: string,
  status: "approved" | "rejected",
  rejectionReason?: string
): Promise<Cause> {
  const supabase = await createClient();

  if (status === "approved") {
    // Get the latest pending edit for this cause
    const { data: edit, error: editError } = await supabase
      .from("cause_edits")
      .select("*")
      .eq("original_cause_id", causeId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (editError && editError.code !== "PGRST116") {
      console.error("Error fetching cause edit for approval:", editError);
      throw editError;
    }

    if (edit) {
      // Copy edit fields into causes
      const updateData: any = {
        title: edit.title,
        category: edit.category,
        goal: edit.goal,
        image: edit.image,
        days_active: edit.days_active,
        multimedia: edit.multimedia,
        video_links: edit.video_links,
        status: "approved",
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error: updateError } = await supabase
        .from("causes")
        .update(updateData)
        .eq("id", causeId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating cause with approved edit:", updateError);
        throw updateError;
      }

      // Remove the approved edit row
      await supabase.from("cause_edits").delete().eq("id", edit.id);

      revalidatePath("/dashboard/admin/causes");
      return updated as Cause;
    } else {
      // No edit found, approve the main cause directly
      const { data: updated, error: updateError } = await supabase
        .from("causes")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", causeId)
        .select()
        .single();

      if (updateError) {
        console.error("Error approving cause:", updateError);
        throw updateError;
      }

      revalidatePath("/dashboard/admin/causes");
      return updated as Cause;
    }
  }

  if (status === "rejected") {
    // Get the latest pending edit
    const { data: edit, error: editError } = await supabase
      .from("cause_edits")
      .select("*")
      .eq("original_cause_id", causeId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (edit && !editError) {
      await supabase
        .from("cause_edits")
        .update({ status: "rejected", rejection_reason: rejectionReason })
        .eq("id", edit.id);
    }

    // Optionally mark the main cause as rejected too
    const { data, error } = await supabase
      .from("causes")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", causeId)
      .select()
      .single();

    if (error) {
      console.error("Error updating cause status:", error);
      throw error;
    }

    revalidatePath("/dashboard/admin/causes");
    return data as Cause;
  }

  throw new Error(`Invalid status value: ${status}`);
}

/**
 * Get all pending cause edits for admin review
 */
export async function getCauseEdits(): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cause_edits")
    .select(
      `
      *,
      profiles!inner (
        full_name,
        email,
        profile_photo
      ),
      cause_edit_sections (
        id,
        heading,
        description
      )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cause edits:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get all causes for a specific user
 */
export async function getUserCauses(userId: string): Promise<Cause[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("causes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user causes:", error);
    throw error;
  }

  return data as Cause[];
}

export async function getUserCausesWithStatus(
  userId: string,
  status?: string
): Promise<Cause[]> {
  const supabase = await createClient();

  let query = supabase
    .from("causes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Only apply status filter if status is provided and not empty
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user causes with status:", error);
    throw error;
  }

  return data as Cause[];
}

export async function deleteCause(causeId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("causes").delete().eq("id", causeId);

  if (error) {
    console.error("Error deleting cause:", error);
    throw error;
  }
}

/**
 * Save a cause share to the database
 */
export async function saveCauseShare(causeId: string): Promise<void> {
  const supabase = await createClient();

  // Start a transaction
  const { error: shareError, data: causeData } = await supabase
    .from("causes")
    .select("shared")
    .eq("id", causeId)
    .single();
  if (shareError) {
    console.error("Error saving cause share:", shareError);
    throw shareError;
  }

  const { data: mine, error: causeError } = await supabase
    .from("causes")
    .update({ shared: causeData.shared + 1 })
    .eq("id", causeId)
    .single();

  if (causeError) {
    console.error("Error saving cause share:", causeError);
    throw causeError;
  }

  return mine;
}
