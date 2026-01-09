"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThreadCreationHero } from "@/components/thread-creation-hero";
import { ThreadFacts } from "@/components/thread-facts";
import { Turnstile } from "@marsidev/react-turnstile";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewThreadPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/threads/new");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      setSubmitStatus({
        type: "error",
        message: "You must be logged in to create a thread.",
      });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Title and content are required.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    if (!turnstileToken) {
      setSubmitStatus({
        type: "error",
        message: "Please complete the CAPTCHA",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Verify Turnstile token
      const verifyRes = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setSubmitStatus({
          type: "error",
          message: verifyData.message || "CAPTCHA verification failed",
        });
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();

      // Generate slug from title
      const slug = generateSlug(formData.title.trim());

      // Parse tags (comma-separated)
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Prepare thread data
      const threadData = {
        title: formData.title.trim(),
        slug: slug,
        content: formData.content.trim(),
        tags: tagsArray.length > 0 ? tagsArray : [],
        author_name: profile.full_name || profile.email?.split("@")[0] || "Anonymous",
        author_email: profile.email || null,
        is_approved: false, // Requires admin approval
        is_locked: false,
        like_count: 0,
        view_count: 0,
        is_featured: false,
        user_id: profile.id, // Use public_users.id
      };

      const { data, error } = await supabase
        .from("threads")
        .insert([threadData])
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate slug error
        if (error.code === "23505" || error.message?.includes("unique")) {
          setSubmitStatus({
            type: "error",
            message: "A thread with this title already exists. Please choose a different title.",
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: error.message || "Failed to create thread. Please try again.",
          });
        }
      } else if (data) {
        setSubmitStatus({
          type: "success",
          message: "Thread submitted successfully! It will be reviewed by an admin before publishing.",
        });
        // Redirect to threads page after a short delay
        setTimeout(() => {
          router.push("/threads");
        }, 2000);
      }
    } catch (error: unknown) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
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
    <div className="min-h-screen bg-background pb-12">
      <ThreadCreationHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-3">
            <Link
              href="/threads"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Discussions</span>
            </Link>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter thread title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  maxLength={200}
                  className="text-lg font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your thread content here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., pharmacy, drug-interactions, clinical-practice"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas. Tags help others find your thread.
                </p>
              </div>

              {/* Submit Status */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-lg ${submitStatus.type === "success"
                    ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                    }`}
                >
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}

              {/* Turnstile */}
              <div className="mb-4">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setSubmitStatus({ type: "error", message: "CAPTCHA error" })}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button type="submit" disabled={isSubmitting} size="lg" className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Thread"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/threads")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar - Facts */}
          <div className="hidden lg:block lg:col-span-1">
            <ThreadFacts />
          </div>
        </div>
      </div>
    </div>
  );
}

