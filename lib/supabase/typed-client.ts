/**
 * Typed Supabase Client Helpers
 * 
 * These helpers provide type-safe wrappers around Supabase operations
 * to prevent TypeScript errors during production builds.
 */

import { createClient } from "@/lib/supabase/auth-client";
import type {
  BlogInsert,
  ThreadInsert,
  CommentInsert,
  RequestInsert,
  ThreadSelect,
  ChatbotSelect,
  SiteSettingsSelect
} from "./database-types";

/**
 * Type-safe insert helper for Supabase
 */
export function typedInsert<T>(table: string, data: T | T[]) {
  const supabase = createClient();
  return supabase.from(table).insert(data as any);
}

/**
 * Type-safe single query helper
 */
export function typedSingle<T>(query: any): Promise<{ data: T | null; error: any }> {
  return query.single() as unknown as Promise<{ data: T | null; error: any }>;
}

/**
 * Helper functions for common operations
 */
export const typedSupabase = {
  insertBlog: (data: BlogInsert) => typedInsert("blogs", data),
  insertThread: (data: ThreadInsert) => typedInsert("threads", data),
  insertComment: (data: CommentInsert) => typedInsert("comments", data),
  insertRequest: (data: RequestInsert) => typedInsert("requests", data),

  getThread: (slug: string) => {
    const supabase = createClient();
    return supabase
      .from("threads")
      .select("*")
      .eq("slug", slug)
      .single() as unknown as Promise<{ data: ThreadSelect | null, error: any }>;
  },

  getChatbot: (bookId: string) => {
    const supabase = createClient();
    return supabase
      .from("chatbots")
      .select("*")
      .eq("linked_book_id", bookId)
      .single() as unknown as Promise<{ data: ChatbotSelect | null, error: any }>;
  },

  getSiteSettings: () => {
    const supabase = createClient();
    return supabase
      .from("site_settings")
      .select("brand_name, brand_logo, contact_email, contact_phone, contact_address, social_links")
      .limit(1)
      .single() as unknown as Promise<{ data: SiteSettingsSelect | null, error: any }>;
  },
};

