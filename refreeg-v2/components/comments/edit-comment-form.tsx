"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EditCommentForm({
  initialContent,
  onSave,
  onCancel
}: {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(content);
    }} className="mt-2 space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || content === initialContent}
        >
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}