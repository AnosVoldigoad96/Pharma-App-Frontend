// Database types for Supabase operations
// These types represent the database schema for insert/update operations

export type BlogInsert = {
  title: string
  subtitle?: string | null
  slug: string
  excerpt?: string | null
  content: string
  cover_image?: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[] | null
  og_image?: string | null
  is_published?: boolean
  is_featured?: boolean
  user_id?: string | null
}

export type ThreadInsert = {
  title: string
  slug: string
  content: string
  tags?: string[]
  author_name: string
  author_email?: string | null
  is_approved?: boolean
  is_locked?: boolean
  like_count?: number
  view_count?: number
  is_featured?: boolean
  user_id?: string | null
}

export type CommentInsert = {
  thread_id: string
  content: string
  author_name: string
  is_approved?: boolean
  like_count?: number
  user_id?: string | null
}

export type RequestInsert = {
  type: 'book' | 'tool' | 'other'
  title: string
  description: string
  status?: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  user_name?: string | null
  user_email?: string | null
}

export type SiteSettingsSelect = {
  brand_name: string | null
  brand_logo: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_address: string | null
  social_links: Array<{
    platform: string
    url: string
    icon?: string
  }> | null
}

export type ThreadSelect = {
  id: string
  is_locked: boolean
  slug: string
  title: string
  content: string
  author_name: string
  author_email: string | null
  tags: string[] | null
  is_approved: boolean
  is_featured: boolean
  like_count: number
  view_count: number
  created_at: string
  user_id: string | null
}

export type ChatbotSelect = {
  id: string
  name: string
  description: string | null
  system_prompt: string
  linked_book_id: string | null
  created_at: string
  model_name: string
}

