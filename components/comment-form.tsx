"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  threadId: string;
  threadSlug: string;
  isLocked: boolean;
  onCommentAdded?: () => void;
}

export function CommentForm({ threadId, threadSlug, isLocked, onCommentAdded }: CommentFormProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="bg-muted/50 border border-muted rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Please <Button variant="link" asChild className="p-0 h-auto"><a href="/login">sign in</a></Button> to comment.
        </p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="bg-muted/50 border border-muted rounded-lg p-4 flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          This thread is locked. No new comments can be added.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment content is required.");
      return;
    }

    if (!profile) {
      setError("User profile not found.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const commentData = {
        thread_id: threadId,
        content: content.trim(),
        author_name: profile.full_name || profile.email?.split("@")[0] || "Anonymous",
        is_approved: true,
        like_count: 0,
        user_id: profile.id,
      };

      const { error: insertError } = await supabase
        .from("comments")
        .insert([commentData]);

      if (insertError) {
        setError(insertError.message || "Failed to submit comment. Please try again.");
      } else {
        setContent("");
        setError(null);
        // Refresh the page to show the new comment
        if (onCommentAdded) {
          onCommentAdded();
        } else {
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="What are your thoughts?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="resize-none text-sm"
        disabled={isSubmitting}
      />

      {error && (
        <div className="p-2 rounded bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {content && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setContent("");
              setError(null);
            }}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
          size="sm"
          className="text-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Posting...
            </>
          ) : (
            "Comment"
          )}
        </Button>
      </div>
    </form>
  );
}

