"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/auth-client";
import { RichTextEditor } from "@/components/rich-text-editor";
import Image from "next/image";
import { BlogCreationHero } from "@/components/blog-creation-hero";
import { BloggingFacts } from "@/components/blogging-facts";

export default function WriteBlogPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    cover_image: "",
  });

  // Fetch brand name on mount
  useEffect(() => {
    const fetchBrandName = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("brand_name")
        .limit(1)
        .single<{ brand_name: string | null }>();
      if (data?.brand_name) {
        setBrandName(data.brand_name);
      }
    };
    fetchBrandName();
  }, []);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSubmitStatus({
        type: "error",
        message: "Please upload an image file.",
      });
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      setSubmitStatus({
        type: "error",
        message: "Image size must be less than 1MB.",
      });
      return;
    }

    setIsUploadingImage(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cms-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cms-uploads").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        cover_image: publicUrl,
      }));

      setSubmitStatus({
        type: "success",
        message: "Cover image uploaded successfully!",
      });
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      cover_image: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    if (!user || !profile) {
      setSubmitStatus({
        type: "error",
        message: "You must be logged in to create a blog post.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.title.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a title.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Please enter content.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      // Append brand name to title
      const finalTitle = brandName
        ? `${formData.title.trim()} | ${brandName}`
        : formData.title.trim();

      // Generate slug from title (before appending brand name)
      const slug = generateSlug(formData.title.trim());

      // Prepare blog data
      const blogData = {
        title: finalTitle,
        subtitle: formData.subtitle.trim() || null,
        slug: slug,
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        cover_image: formData.cover_image || null,
        meta_title: null, // Will default to title
        meta_description: formData.excerpt.trim() || null, // Will default to excerpt
        meta_keywords: null,
        og_image: formData.cover_image || null, // Will default to cover image
        is_published: false, // Always false for admin review
        is_featured: false,
        user_id: profile.id, // Use public_users.id
      };

      const { data, error } = await supabase
        .from("blogs")
        .insert([blogData] as any)
        .select()
        .single();

      if (error) {
        setSubmitStatus({
          type: "error",
          message: error.message || "Failed to create blog post. Please try again.",
        });
      } else if (data) {
        setSubmitStatus({
          type: "success",
          message: "Blog post submitted successfully! It will be reviewed by an admin before publishing.",
        });
        // Redirect to blogs page after a short delay
        setTimeout(() => {
          router.push("/blogs");
        }, 2000);
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "An unexpected error occurred. Please try again.",
      });
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
      <BlogCreationHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-3">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blogs</span>
            </Link>

            {submitStatus.type && (
              <div
                className={`mb-6 p-4 rounded-md border ${submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                  className="text-lg font-medium"
                />
                {brandName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Brand name "{brandName}" will be automatically appended to the title
                  </p>
                )}
              </div>

              {/* Subtitle */}
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium mb-2">
                  Subtitle
                </label>
                <Input
                  id="subtitle"
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter subtitle (optional)"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the blog post (optional)"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                  rows={3}
                />
              </div>

              {/* Cover Image Upload - HIDDEN */}
              {/* 
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Image
                </label>
                {formData.cover_image ? (
                  <div className="relative w-full max-w-md">
                    <div className="relative aspect-video rounded-md overflow-hidden border border-input">
                      <Image
                        src={formData.cover_image}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-input rounded-md p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isUploadingImage
                          ? "Uploading..."
                          : "Click to upload cover image (max 1MB)"}
                      </span>
                    </label>
                  </div>
                )}
              </div>
              */}

              {/* Content - Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog post content here..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button type="submit" disabled={isSubmitting || isUploadingImage} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
                <Link href="/blogs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar - Facts */}
          <div className="hidden lg:block lg:col-span-1">
            <BloggingFacts />
          </div>
        </div>
      </div>
    </div>
  );
}
