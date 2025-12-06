"use client";

import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Book, Chatbot } from "@/lib/supabase/types";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import { useAuth } from "@/contexts/auth-context";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);

  // Fetch chatbot when ai_chat_enabled is true
  useEffect(() => {
    if (book.ai_chat_enabled && book.id) {
      const supabase = createClient();
      supabase
        .from("chatbots")
        .select("*")
        .eq("linked_book_id", book.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setChatbot(data as Chatbot);
          }
        });
    }
  }, [book.ai_chat_enabled, book.id]);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.purchase_link) {
      window.open(book.purchase_link, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.pdf_url) {
      setIsDownloading(true);
      // Open PDF in new tab or trigger download
      const link = document.createElement("a");
      link.href = book.pdf_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If user is not logged in, show sign-in dialog
    if (!user) {
      setShowSignInDialog(true);
      return;
    }
    
    if (isRequesting || requestSuccess) return;

    setIsRequesting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("requests")
        .insert([
          {
            type: "book",
            title: book.title,
            description: `Request for book: ${book.title}${book.author ? ` by ${book.author}` : ""}`,
            status: "pending",
          },
        ]);

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


  return (
    <div className="group relative block rounded-lg hover:shadow-lg transition-shadow bg-card border">
      <GlowingEffect
        disabled={false}
        spread={30}
        proximity={50}
        variant="default"
        glow={true}
        blur={0}
        borderWidth={1}
      />
      <div className="relative z-10 rounded-lg overflow-hidden">
        <Link href={`/books/${book.id}`}>
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Cover</span>
            </div>
          )}
        </Link>
        <div className="p-4">
          <Link href={`/books/${book.id}`}>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {book.title}
            </h3>
          </Link>
          {book.author && (
            <p className="text-sm text-muted-foreground mb-2">
              By {book.author}
            </p>
          )}
          {book.edition && (
            <p className="text-xs text-muted-foreground mb-2">
              Edition: {book.edition}
            </p>
          )}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {book.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {book.ai_chat_enabled && chatbot && (
            <div className="mb-3">
              <Link
                href={`/books/${book.id}/chat`}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                Chat with {chatbot.name}
              </Link>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.purchase_link && (
              <Button
                onClick={handleBuy}
                variant="default"
                size="sm"
                className="flex-1 min-w-[80px]"
              >
                Buy
              </Button>
            )}
            {user ? (
              // Logged in users see Download button
              book.pdf_url && (
                <Button
                  onClick={handleDownload}
                  variant={book.purchase_link ? "outline" : "default"}
                  size="sm"
                  className={book.purchase_link ? "flex-1 min-w-[80px]" : "w-full"}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              )
            ) : (
              // Logged out users see Request button
              <Button
                onClick={handleRequest}
                variant={book.purchase_link ? "outline" : "default"}
                size="sm"
                className={book.purchase_link ? "flex-1 min-w-[80px]" : "w-full"}
                disabled={isRequesting || requestSuccess}
              >
                {isRequesting
                  ? "Requesting..."
                  : requestSuccess
                  ? "Requested!"
                  : "Request"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to request this book. You need an account to submit book requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignInDialog(false)}
            >
              Cancel
            </Button>
            <Button asChild>
              <Link href="/login" onClick={() => setShowSignInDialog(false)}>
                Sign In
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

