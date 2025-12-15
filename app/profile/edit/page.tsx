"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/auth-client";
import { Upload, X } from "lucide-react";
import { ProfileHero } from "@/components/profile-hero";

export default function EditProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    occupation: "",
    phone: "",
    gender: "",
    age: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
        occupation: profile.occupation || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        age: profile.age?.toString() || "",
      });
    }
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    setIsUploadingImage(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") // Assuming 'avatars' bucket exists, or use 'cms-uploads' if preferred
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // Fallback to cms-uploads if avatars bucket doesn't exist
        if (uploadError.message.includes("Bucket not found")) {
          const { data: fallbackData, error: fallbackError } = await supabase.storage
            .from("cms-uploads")
            .upload(`avatars/${fileName}`, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (fallbackError) throw fallbackError;

          const { data: { publicUrl } } = supabase.storage.from("cms-uploads").getPublicUrl(`avatars/${fileName}`);
          setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
        } else {
          throw uploadError;
        }
      } else {
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
        setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      }
    } catch (error: any) {
      setError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const updates: any = {
        full_name: formData.full_name || null,
        avatar_url: formData.avatar_url || null,
        occupation: formData.occupation || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
      };

      console.log("Submitting updates:", updates);

      const { data, error: updateError } = await updateUserProfile(updates);

      console.log("Update result:", { data, updateError });

      if (updateError) {
        const errorMessage = updateError instanceof Error
          ? updateError.message
          : (updateError as any)?.message || "Failed to update profile. Please try again.";
        setError(errorMessage);
      } else {
        setSuccess(true);
        await refreshProfile();
        router.refresh();
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-background pb-12">
      <ProfileHero
        heading="Edit Profile"
        subtitle="Update your account information"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href="/profile"
              className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
            >
              ← Back to Profile
            </Link>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-6 bg-card">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              {formData.avatar_url ? (
                <div className="relative">
                  <Image
                    src={formData.avatar_url}
                    alt="Avatar preview"
                    width={100}
                    height={100}
                    className="rounded-full object-cover w-24 h-24 border-2 border-border"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar_url: "" })}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold border-2 border-border">
                  {(formData.full_name || user.email || "U")[0].toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingImage ? "Uploading..." : "Upload New Picture"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Max 2MB. JPG, PNG, or GIF.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium mb-2">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                placeholder="e.g., Pharmacist, Medical Student"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1234567890"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="25"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div className="pt-4 border-t flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/profile"
                className="px-6 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
