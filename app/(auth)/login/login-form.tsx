"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Lanyard from "@/components/Lanyard";
import { AuthHeroBackground } from "@/components/auth-hero-background";

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
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        <AuthHeroBackground />

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
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background dark:bg-black">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {settings.brandLogo && (
                <Image
                  src={settings.brandLogo}
                  alt={settings.brandName}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              )}
              <span className="text-xl font-bold text-foreground">{settings.brandName}</span>
            </Link>
          </div>

          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to {settings.brandName}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Login to access your pharmaceutical resources
          </p>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="pharmacist@epharmatica.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Log in"} &rarr;
              <BottomGradient />
            </button>

            <div className="mt-4 text-center text-sm">
              <p className="text-neutral-600 dark:text-neutral-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
