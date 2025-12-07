"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/auth-client";
import type { Book } from "@/lib/supabase/types";

interface BookDetailClientProps {
  book: Book & { book_categories: { name: string } | null };
}

export function BookDetailClient({ book }: BookDetailClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleDownload = async () => {
    if (!book.pdf_url) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = book.pdf_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleRequest = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsRequesting(true);
    setRequestSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("book_requests").insert({
        book_id: book.id,
        user_id: user.id,
        status: "pending",
      });

      if (error) {
        console.error("Error submitting request:", error);
        alert("Failed to submit request. Please try again.");
      } else {
        setRequestSuccess(true);
        setTimeout(() => setRequestSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  if (!book.pdf_url) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Download</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {user
          ? "Click the button below to download this book."
          : "Sign in to download this book."}
      </p>
      {user ? (
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      ) : (
        <Button
          onClick={handleRequest}
          disabled={isRequesting || requestSuccess}
          className="w-full flex items-center gap-2"
        >
          {isRequesting
            ? "Requesting..."
            : requestSuccess
            ? "Request Submitted!"
            : "Request Access"}
        </Button>
      )}
    </div>
  );
}

