"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/auth-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CommentPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/threads/${slug}/comment`);
    }
  }, [user, loading, router, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      setSubmitStatus({
        type: "error",
        message: "You must be logged in to comment.",
      });
      return;
    }

    if (!content.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Comment content is required.",
      });
      return;
    }

    if (!slug) {
      setSubmitStatus({
        type: "error",
        message: "Thread not found.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const supabase = createClient();

      // First, get the thread ID from slug
      const { data: thread, error: threadError } = await supabase
        .from("threads")
        .select("id, is_locked")
        .eq("slug", slug)
        .single<{ id: string; is_locked: boolean }>();

      if (threadError || !thread) {
        setSubmitStatus({
          type: "error",
          message: "Thread not found.",
        });
        setIsSubmitting(false);
        return;
      }

      if (thread.is_locked) {
        setSubmitStatus({
          type: "error",
          message: "This thread is locked. No new comments can be added.",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare comment data
      const commentData = {
        thread_id: thread.id,
        content: content.trim(),
        author_name: profile.full_name || profile.email?.split("@")[0] || "Anonymous",
        is_approved: true, // Comments are approved immediately
        like_count: 0,
        user_id: profile.id, // Use public_users.id
      };

      const { data, error } = await supabase
        .from("comments")
        .insert([commentData] as any)
        .select()
        .single();

      if (error) {
        setSubmitStatus({
          type: "error",
          message: error.message || "Failed to submit comment. Please try again.",
        });
      } else if (data) {
        setSubmitStatus({
          type: "success",
          message: "Comment posted successfully!",
        });
        // Redirect to thread page after a short delay
        setTimeout(() => {
          router.push(`/threads/${slug}`);
        }, 2000);
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/threads/${slug}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Thread</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Add Comment</h1>
          <p className="text-muted-foreground">
            Share your thoughts and contribute to the discussion
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Comment <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your comment here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters
            </p>
          </div>

          {/* Submit Status */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                  : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              }`}
            >
              <p className="text-sm">{submitStatus.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Comment"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/threads/${slug}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

