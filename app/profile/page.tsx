"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "Profile"}
                width={80}
                height={80}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                {(profile?.full_name || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">
                {profile?.full_name || user.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              {profile?.role && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-muted rounded">
                  {profile.role}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <p className="text-muted-foreground">
                {profile?.full_name || "Not set"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            {profile?.occupation && (
              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <p className="text-muted-foreground">{profile.occupation}</p>
              </div>
            )}

            {profile?.phone && (
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <p className="text-muted-foreground">{profile.phone}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Member Since</label>
              <p className="text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

