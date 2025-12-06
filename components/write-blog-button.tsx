"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenSquare, LogIn } from "lucide-react";

export function WriteBlogButton() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return null;
  }

  // If user is logged in, show "Write a Blog" button
  if (user) {
    return (
      <Link href="/blogs/write">
        <Button className="gap-2">
          <PenSquare className="h-4 w-4" />
          Write a Blog
        </Button>
      </Link>
    );
  }

  // If user is not logged in, show "Sign in to write a blog" button
  return (
    <Link href="/login">
      <Button variant="outline" className="gap-2">
        <LogIn className="h-4 w-4" />
        Sign in to write a blog
      </Button>
    </Link>
  );
}

