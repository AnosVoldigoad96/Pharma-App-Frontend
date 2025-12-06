"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Thread, Comment } from "@/lib/supabase/types";

interface ThreadDetailClientProps {
  thread: Thread;
  comments: Comment[];
}

export function ThreadDetailClient({ thread, comments }: ThreadDetailClientProps) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(thread.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    comments.forEach((comment) => {
      initial[comment.id] = comment.like_count || 0;
    });
    return initial;
  });
  const [likingComments, setLikingComments] = useState<Record<string, boolean>>({});

  // Increment view count on mount
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`/api/threads/${thread.id}/view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };
    incrementView();
  }, [thread.id]);

  const handleThreadLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    const wasLiked = likeCount > (thread.like_count || 0);

    try {
      const response = wasLiked
        ? await fetch(`/api/threads/${thread.id}/like`, { method: "DELETE" })
        : await fetch(`/api/threads/${thread.id}/like`, { method: "POST" });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);
      }
    } catch (error) {
      console.error("Failed to like thread:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!user || likingComments[commentId]) return;

    setLikingComments((prev) => ({ ...prev, [commentId]: true }));
    const currentCount = commentLikes[commentId] || 0;
    const wasLiked = currentCount > (comments.find((c) => c.id === commentId)?.like_count || 0);

    try {
      const response = wasLiked
        ? await fetch(`/api/comments/${commentId}/like`, { method: "DELETE" })
        : await fetch(`/api/comments/${commentId}/like`, { method: "POST" });

      if (response.ok) {
        const data = await response.json();
        setCommentLikes((prev) => ({ ...prev, [commentId]: data.like_count }));
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    } finally {
      setLikingComments((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <>
      {/* Thread Like Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleThreadLike}
          disabled={isLiking}
          className="flex items-center gap-2"
        >
          <Heart
            className={`h-4 w-4 ${
              likeCount > (thread.like_count || 0) ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{likeCount}</span>
        </Button>
      </div>

      {/* Comment Like Buttons */}
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCommentLike(comment.id)}
            disabled={!user || likingComments[comment.id]}
            className="flex items-center gap-1 h-8"
          >
            <Heart
              className={`h-3 w-3 ${
                (commentLikes[comment.id] || 0) > (comment.like_count || 0)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
            <span className="text-xs">{commentLikes[comment.id] || comment.like_count || 0}</span>
          </Button>
        </div>
      ))}
    </>
  );
}

// Component to increment view count
export function ViewCountIncrementer({ threadId }: { threadId: string }) {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`/api/threads/${threadId}/view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };
    incrementView();
  }, [threadId]);

  return null;
}

// Separate component for thread like button
export function ThreadLikeButton({ thread }: { thread: Thread }) {
  const [likeCount, setLikeCount] = useState(thread.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleThreadLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const wasLiked = likeCount > (thread.like_count || 0);

    try {
      const response = wasLiked
        ? await fetch(`/api/threads/${thread.id}/like`, { 
            method: "DELETE",
            credentials: "include",
          })
        : await fetch(`/api/threads/${thread.id}/like`, { 
            method: "POST",
            credentials: "include",
          });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);
      } else {
        const errorData = await response.json();
        console.error("Like error:", errorData);
      }
    } catch (error) {
      console.error("Failed to like thread:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = likeCount > (thread.like_count || 0);

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleThreadLike}
        disabled={isLiking}
        className="h-8 w-8 p-0 hover:bg-muted"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </Button>
      <span className={`text-xs font-semibold ${isLiked ? "text-red-500" : "text-muted-foreground"}`}>
        {likeCount}
      </span>
    </div>
  );
}

// Separate component for comment like button
export function CommentLikeButton({ comment }: { comment: Comment }) {
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleCommentLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const wasLiked = likeCount > (comment.like_count || 0);

    try {
      const response = wasLiked
        ? await fetch(`/api/comments/${comment.id}/like`, { 
            method: "DELETE",
            credentials: "include",
          })
        : await fetch(`/api/comments/${comment.id}/like`, { 
            method: "POST",
            credentials: "include",
          });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);
      } else {
        const errorData = await response.json();
        console.error("Like error:", errorData);
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = likeCount > (comment.like_count || 0);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCommentLike}
        disabled={isLiking}
        className="h-6 w-6 p-0 hover:bg-muted"
      >
        <Heart
          className={`h-3 w-3 transition-colors ${
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </Button>
      <span className={`text-[10px] font-semibold leading-none ${isLiked ? "text-red-500" : "text-muted-foreground"}`}>
        {likeCount}
      </span>
    </div>
  );
}

