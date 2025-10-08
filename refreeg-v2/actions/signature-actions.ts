"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Signature,
  SignatureWithPetition,
  SignatureFormData,
} from "@/types";

/**
 * Create a new signature for a petition
 * @param petitionId - The ID of the petition to sign
 */
export async function createSignature(
  petitionId: string,
  userId: string | null,
  signatureData: SignatureFormData
): Promise<Signature> {
  const supabase = await createClient();

  // Ensure a user (by name and email) signs only once
  const { count: existingCount, error: existingError } = await supabase
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("petition_id", petitionId)
    .eq("email", signatureData.email)
    .eq("name", signatureData.name);

  if (existingError) {
    console.error("Error checking existing signature:", existingError);
  }
  if ((existingCount || 0) > 0) {
    throw new Error(
      "A signature with this name and email has already been recorded for this petition."
    );
  }

  const { data, error } = await supabase
    .from("signatures")
    .insert({
      petition_id: petitionId,
      ...(userId ? { user_id: userId } : {}),
      amount:
        signatureData?.amount === undefined || signatureData?.amount === null
          ? 1
          : typeof signatureData.amount === "string"
          ? Number.parseFloat(signatureData.amount)
          : signatureData.amount,
      name:
        String(signatureData.isAnonymous).toLocaleLowerCase() === "true"
          ? "Anonymous"
          : signatureData.name,
      email: signatureData.email,
      message: signatureData.message || null,
      is_anonymous: signatureData.isAnonymous,
      status: "completed", // For now, all signatures are immediately completed
    })
    .select()
    .single();

  if (error) {
    // Handle unique violation (user already signed) gracefully
    if ((error as any)?.code === "23505") {
      throw new Error("You have already signed this petition");
    }
    console.error("Error creating signature:", error);
    throw error;
  }

  revalidatePath(`/petitions/${petitionId}`);
  revalidatePath("/petitions");
  revalidatePath("/");
  if (userId) {
    revalidatePath("/dashboard/signatures");
  }

  return data as Signature;
}

/**
 * List signatures for a petition
 * @param petitionId - The ID of the petition to list signatures for
 */
export async function listSignaturesForPetition(
  petitionId: string
): Promise<Signature[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("signatures")
    .select("*")
    .eq("petition_id", petitionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing signatures:", error);
    throw error;
  }

  return data as Signature[];
}

/**
 * List signatures for a user
 * @param userId - The ID of the user to list signatures for
 */
export async function listUserSignatures(
  userId: string,
  timeframe: "all" | "recent" = "all"
): Promise<SignatureWithPetition[]> {
  const supabase = await createClient();

  let query = supabase
    .from("signatures")
    .select(
      `
      *,
      petitions:petition_id (
        title,
        category
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (timeframe === "recent") {
    // Get signatures from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte("created_at", thirtyDaysAgo.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error listing user signatures:", error);
    throw error;
  }

  // Transform the response to match our SignatureWithPetition type
  return data.map((item) => ({
    ...item,
    petition: {
      title: item.petitions?.title || "Unknown Petition",
      category: item.petitions?.category || "Unknown",
    },
  })) as SignatureWithPetition[];
}
