"use server";

import { createClient } from "@/lib/supabase/server";

export async function createPetitionComment(
  petitionId: string,
  userId: string,
  content: string,
  parentId?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("petition_comments")
    .insert({
      petition_id: petitionId,
      user_id: userId,
      content,
      parent_id: parentId || null,
      is_edited: false,
    })
    .select(`*, user:profiles(full_name, profile_photo) `)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePetitionComment(
  commentId: string,
  userId: string,
  content: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("petition_comments")
    .update({ content, is_edited: true })
    .eq("id", commentId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePetitionComment(commentId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("petition_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);
  if (error) throw error;
  return true;
}

export async function listPetitionComments(petitionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("petition_comments")
    .select(`*, user:profiles(full_name, profile_photo)`)
    .eq("petition_id", petitionId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const commentsWithReplies = await Promise.all(
    (data || []).map(async (comment) => {
      const { count } = await supabase
        .from("petition_comments")
        .select("*", { count: "exact" })
        .eq("parent_id", comment.id);
      return { ...comment, replies_count: count || 0 };
    })
  );

  return commentsWithReplies;
}

export async function listRepliesForPetitionComment(commentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("petition_comments")
    .select(`*, user:profiles(full_name, profile_photo)`)
    .eq("parent_id", commentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}
