import { createClient } from "@/lib/supabase/server";
import { Comment } from "@/types/common-types";

export async function createComment(
  causeId: string,
  userId: string,
  content: string,
  parentId?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      cause_id: causeId,
      user_id: userId,
      content,
      parent_id: parentId || null,
      is_edited: false
    })
    .select(`
      *,
      user:profiles(full_name, profile_photo)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateComment(
  commentId: string,
  userId: string,
  content: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      is_edited: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select(`
      *,
      user:profiles(full_name, profile_photo)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}

// ... rest of the existing functions ...

export async function listCommentsForCause(causeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `*, 
      user:profiles(full_name, profile_photo)`
    )
    .eq("cause_id", causeId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Get replies count for each comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const supabase = await createClient();
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact" })
        .eq("parent_id", comment.id);

      return {
        ...comment,
        replies_count: count || 0,
      };
    })
  );

  return commentsWithReplies as Comment[];
}

export async function listRepliesForComment(commentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `*, 
      user:profiles(full_name, profile_photo)`
    )
    .eq("parent_id", commentId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Comment[];
}