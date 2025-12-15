// TypeScript types for Supabase database tables

export type Blog = {
  id: string
  title: string
  subtitle: string | null
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  is_published: boolean
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_image: string | null
  created_at: string
  updated_at: string
  is_featured: boolean
  user_id?: string | null
  author?: {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
  } | null
}

export type BookCategory = {
  id: string
  name: string
  created_at: string
}

export type Book = {
  id: string
  title: string
  author: string | null
  edition: string | null
  category_id: string | null
  tags: string[] | null
  cover_image: string | null
  pdf_url: string | null
  purchase_link: string | null
  isbn: string | null
  ai_chat_enabled: boolean
  seo_id: string | null
  slug: string
  created_at: string
  updated_at: string
  is_featured: boolean
  r2_storage_key: string | null
}

export type BookKnowledge = {
  id: string
  book_id: string | null
  content: string | null
  embedding: unknown | null
}

export type ChatMessage = {
  id: string
  user_id: string
  content: string
  created_at: string
}

export type Chatbot = {
  id: string
  name: string
  description: string | null
  system_prompt: string
  linked_book_id: string | null
  created_at: string
  model_name: string
}

export type Comment = {
  id: string
  thread_id: string
  content: string
  author_name: string
  is_approved: boolean
  created_at: string
  like_count: number
  user_id: string | null
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export type FAQ = {
  id: string
  question: string
  answer: string
  display_order: number
  created_at: string
  updated_at: string
}

export type PageContent = {
  id: string
  page_slug: string
  hero_section: Record<string, unknown> | null
  created_at: string
  updated_at: string
  content: Record<string, unknown>
}

export type PublicUser = {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin' | 'moderator'
  occupation: string | null
  phone: string | null
  gender: string | null
  age: number | null
  created_at: string
  updated_at: string
  is_banned: boolean
  ban_expires_at: string | null
  ban_reason: string | null
}

export type Request = {
  id: string
  type: 'book' | 'tool' | 'other'
  title: string
  description: string | null
  user_name: string | null
  user_email: string | null
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  created_at: string
}

export type SEOMetadata = {
  id: string
  page_slug: string
  meta_title: string | null
  meta_description: string | null
  keywords: string | null
  og_image: string | null
  canonical_url: string | null
  robots: string
  structured_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

// Color properties type
export type ColorProperties = {
  card?: string
  ring?: string
  input?: string
  muted?: string
  accent?: string
  border?: string
  chart1?: string
  chart2?: string
  chart3?: string
  chart4?: string
  chart5?: string
  popover?: string
  primary?: string
  secondary?: string
  background?: string
  foreground?: string
  destructive?: string
  sidebarRing?: string
  sidebarAccent?: string
  sidebarBorder?: string
  cardForeground?: string
  sidebarPrimary?: string
  mutedForeground?: string
  accentForeground?: string
  popoverForeground?: string
  primaryForeground?: string
  sidebarBackground?: string
  sidebarForeground?: string
  secondaryForeground?: string
  destructiveForeground?: string
  sidebarAccentForeground?: string
  sidebarPrimaryForeground?: string
}

export type SocialLink = {
  platform: string
  url: string
  icon?: string
}

export type SiteSettings = {
  id: string
  brand_name: string
  brand_logo: string | null
  // Support both single theme (colors directly) and dual theme (light/dark)
  colors: ColorProperties | {
    light?: ColorProperties
    dark?: ColorProperties
  }
  contact_email: string | null
  contact_phone: string | null
  contact_address: string | null
  social_links: SocialLink[]
  created_at: string
  updated_at: string
  chat_enabled: boolean
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  image_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export type Thread = {
  id: string
  title: string
  slug: string
  content: string
  tags: string[]
  author_name: string
  author_email: string | null
  is_approved: boolean
  is_locked: boolean
  like_count: number
  view_count: number
  created_at: string
  updated_at: string
  is_featured: boolean
  user_id: string | null
}

export type Tool = {
  id: string
  title: string
  description: string | null
  endpoint_url: string
  inputs: Record<string, unknown>
  created_at: string
  category: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  slug: string | null
}

export type AboutUsFeature = {
  icon: string
  title: string
  description: string
  link: string
}

export type AboutUsValue = {
  icon: string
  title: string
  description: string
}

export type Feature = {
  id: string
  title: string
  description: string
  image: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AboutUs = {
  id: string
  mission_title: string | null
  mission_content: string | null
  vision_title: string | null
  vision_content: string | null
  features_section_title: string | null
  features_section_subtitle: string | null
  features: AboutUsFeature[]
  values_section_title: string | null
  values_section_subtitle: string | null
  values: AboutUsValue[]
  cta_heading: string | null
  cta_description: string | null
  cta_primary_button_text: string | null
  cta_primary_button_link: string | null
  cta_secondary_button_text: string | null
  cta_secondary_button_link: string | null
  created_at: string
  updated_at: string
}

