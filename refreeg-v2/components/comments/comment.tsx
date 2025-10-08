"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Comment } from "@/types/common-types";
import { ReplyForm } from "./reply-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditCommentForm } from "./edit-comment-form";

interface CommentProps {
  comment: Comment;
  causeId: string;
  currentUserId?: string;
  onCommentDeleted: (commentId: string) => void;
  entityType?: "cause" | "petition";
}

export function CommentComponent({
  comment,
  causeId,
  currentUserId,
  onCommentDeleted,
  entityType,
}: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCommentDeleted(comment.id);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEdit = async (content: string) => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setReplies(
          replies.map((r) => (r.id === updatedComment.id ? updatedComment : r))
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Link href={`/profile/${comment.user_id}`}>
            {comment.user.profile_photo ? (
              <Image
                src={comment.user.profile_photo}
                alt={comment.user.full_name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {comment.user.full_name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </Link>
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.user_id}`}
              className="font-medium hover:underline"
            >
              {comment.user.full_name || "Anonymous"}
            </Link>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
              {comment.is_edited && (
                <sup className="text-xs text-muted-foreground ml-1">
                  (edited)
                </sup>
              )}
            </span>
          </div>

          {isEditing ? (
            <EditCommentForm
              initialContent={comment.content}
              onSave={handleEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="mt-1 text-sm">{comment.content}</p>
          )}

          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {comment.replies_count === 1
                ? "1 reply"
                : `${comment.replies_count || 0} replies`}
            </button>

            {currentUserId === comment.user_id && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>

          {currentUserId && !isEditing && (
            <div className="mt-3">
              <ReplyForm
                causeId={causeId}
                parentId={comment.id}
                onReplyAdded={(newReply) => {
                  setReplies([...replies, newReply]);
                }}
                entityType={entityType}
              />
            </div>
          )}
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4 border-l-2 pl-4">
          {replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              causeId={causeId}
              currentUserId={currentUserId}
              onCommentDeleted={onCommentDeleted}
              entityType={entityType}
            />
          ))}
        </div>
      )}
    </div>
  );
}
