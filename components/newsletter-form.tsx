"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription API
    // For now, just show success message
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "success"}
        />
        <Button type="submit" size="sm" className="shrink-0" disabled={status === "success"}>
          {status === "success" ? "Subscribed!" : "Subscribe"}
        </Button>
      </div>
      {status === "success" && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Thank you for subscribing!
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}

