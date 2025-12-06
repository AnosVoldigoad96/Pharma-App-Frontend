import { notFound } from "next/navigation";
import Link from "next/link";
import { getThreadBySlug, getThreadComments } from "@/lib/supabase/queries";
import { ArrowLeft, Calendar, Eye, MessageSquare, User, Lock } from "lucide-react";
import type { Metadata } from "next";
import { ThreadLikeButton, CommentLikeButton, ViewCountIncrementer } from "@/components/thread-detail-client";
import { CommentForm } from "@/components/comment-form";

interface ThreadPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: thread } = await getThreadBySlug(resolvedParams.slug);

  if (!thread) {
    return {
      title: "Thread Not Found",
    };
  }

  return {
    title: `${thread.title} | ePharmatica Forums`,
    description: thread.content.substring(0, 160) + "...",
  };
}

export default async function ThreadDetailPage({ params }: ThreadPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { data: thread } = await getThreadBySlug(resolvedParams.slug);

  if (!thread) {
    notFound();
  }

  // Fetch comments for this thread
  const { data: comments } = await getThreadComments(thread.id);
  const threadComments = comments || [];

  return (
    <>
      <ViewCountIncrementer threadId={thread.id} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4">
          {/* Back Button */}
          <Link
            href="/threads"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Discussions</span>
          </Link>

          {/* Thread Header - Reddit Style */}
          <article className="bg-card border border-border rounded-md mb-4">
            {/* Thread Meta Bar */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">r/{thread.tags?.[0] || "discussion"}</span>
              <span>•</span>
              <span>Posted by u/{thread.author_name}</span>
              <span>•</span>
              <span>{new Date(thread.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span>
            </div>

            {/* Thread Content */}
            <div className="p-4">
              <div className="flex gap-4">
                {/* Vote Section (Left) */}
                <div className="flex flex-col items-center gap-1">
                  <ThreadLikeButton thread={thread} />
                </div>

                {/* Main Content (Right) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    {thread.is_locked && (
                      <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                    {thread.is_featured && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-semibold">
                        Featured
                      </span>
                    )}
                    <h1 className="text-xl font-semibold leading-tight">{thread.title}</h1>
                  </div>

                  {/* Thread Content */}
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-4">
                    {thread.content}
                  </div>

                  {/* Tags */}
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {thread.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{threadComments.length} {threadComments.length === 1 ? "comment" : "comments"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{thread.view_count} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section - Reddit Style */}
          <div className="bg-card border border-border rounded-md">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">
                {threadComments.length} {threadComments.length === 1 ? "Comment" : "Comments"}
              </h2>
            </div>

            {/* Comments List */}
            {threadComments.length > 0 ? (
              <div className="divide-y divide-border">
                {threadComments.map((comment) => (
                  <div key={comment.id} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                    <div className="flex gap-3">
                      {/* Vote Section (Left) */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <CommentLikeButton comment={comment} />
                      </div>

                      {/* Comment Content (Right) */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-foreground">
                            {comment.author_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {new Date(comment.created_at).getFullYear() !== new Date().getFullYear() && 
                              ` ${new Date(comment.created_at).getFullYear()}`
                            }
                          </span>
                        </div>
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              </div>
            )}

            {/* Comment Form at the End */}
            <div className="px-4 py-4 border-t border-border">
              <CommentForm
                threadId={thread.id}
                threadSlug={thread.slug}
                isLocked={thread.is_locked}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
