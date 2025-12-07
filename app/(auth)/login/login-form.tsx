"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Lanyard from "@/components/Lanyard";

interface LoginFormProps {
  settings: {
    brandName: string;
    brandLogo: string | null;
    subtitle: string;
  };
}

export function LoginForm({ settings }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { user, error: signInError } = await signIn(
        formData.email,
        formData.password
      );

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
      } else if (user) {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - 2/3 width */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-primary/50 via-chart-5/40 to-chart-4/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {/* Brand logo and name in upper left corner */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {settings.brandLogo && (
              <Image
                src={settings.brandLogo}
                alt={settings.brandName}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            )}
            <h1 className="text-3xl font-bold text-white">{settings.brandName}</h1>
          </Link>
        </div>
        {/* Return to home button in upper right corner */}
        <div className="absolute top-8 right-8 z-20">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10 border-2 border-white/20">
              ← Return to Home
            </Button>
          </Link>
        </div>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>

      {/* Right Column - 1/3 width */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-muted-foreground">
              Sign in to your account to access exclusive features
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive border-2 border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password *
              </label>
              <Input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

