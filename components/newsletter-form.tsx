"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
            <Mail className="h-5 w-5" />
          </div>
          <Input
            type="email"
            placeholder="Enter your email address"
            className="h-12 pl-10 bg-background/50 border-white/10 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 rounded-lg transition-all duration-300 hover:bg-background/70 hover:border-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "success" || status === "loading"}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className={cn(
            "h-12 px-8 rounded-lg font-medium transition-all duration-300 shrink-0",
            status === "success"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
          )}
          disabled={status === "success" || status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status === "success" ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Subscribed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Subscribe</span>
            </div>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
        {status === "success" ? (
          <p className="text-green-500 font-medium animate-in fade-in slide-in-from-bottom-1 duration-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            Successfully subscribed!
          </p>
        ) : (
          <p>We respect your privacy. Unsubscribe at any time.</p>
        )}
      </div>
    </form>
  );
}
