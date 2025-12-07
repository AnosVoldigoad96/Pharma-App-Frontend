-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blogs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  cover_image text,
  is_published boolean DEFAULT false,
  meta_title text,
  meta_description text,
  meta_keywords ARRAY,
  og_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_featured boolean DEFAULT false,
  CONSTRAINT blogs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.book_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT book_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.book_knowledge (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  book_id uuid,
  content text,
  embedding USER-DEFINED,
  CONSTRAINT book_knowledge_pkey PRIMARY KEY (id),
  CONSTRAINT book_knowledge_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  edition text,
  category_id uuid,
  tags ARRAY,
  cover_image text,
  pdf_url text,
  purchase_link text,
  isbn text,
  ai_chat_enabled boolean DEFAULT false,
  seo_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_featured boolean DEFAULT false,
  CONSTRAINT books_pkey PRIMARY KEY (id),
  CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.book_categories(id),
  CONSTRAINT books_seo_id_fkey FOREIGN KEY (seo_id) REFERENCES public.seo_metadata(id)
);
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.public_users(id)
);
CREATE TABLE public.chatbots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  system_prompt text NOT NULL,
  linked_book_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  model_name text NOT NULL DEFAULT 'gemini-2.0-flash-lite-preview-02-05'::text,
  CONSTRAINT chatbots_pkey PRIMARY KEY (id),
  CONSTRAINT chatbots_linked_book_id_fkey FOREIGN KEY (linked_book_id) REFERENCES public.books(id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL,
  content text NOT NULL,
  author_name text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  like_count integer DEFAULT 0,
  user_id uuid,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.threads(id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.public_users(id)
);
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new'::text CHECK (status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT contact_submissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.features (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT features_pkey PRIMARY KEY (id)
);
CREATE TABLE public.page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  hero_section jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  content jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT page_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.public_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text])),
  occupation text,
  phone text,
  gender text,
  age integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_banned boolean DEFAULT false,
  ban_expires_at timestamp with time zone,
  ban_reason text,
  CONSTRAINT public_users_pkey PRIMARY KEY (id),
  CONSTRAINT public_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type = ANY (ARRAY['book'::text, 'tool'::text, 'other'::text])),
  title text NOT NULL,
  description text,
  user_name text,
  user_email text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'fulfilled'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seo_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  keywords text,
  og_image text,
  canonical_url text,
  robots text DEFAULT 'index, follow'::text,
  structured_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT seo_metadata_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_name text DEFAULT 'AntiGravity'::text,
  brand_logo text,
  colors jsonb DEFAULT '{"dark": {"muted": "#1f2937", "accent": "#60a5fa", "primary": "#ffffff", "secondary": "#a3a3a3"}, "light": {"muted": "#f3f4f6", "accent": "#3b82f6", "primary": "#000000", "secondary": "#666666"}}'::jsonb,
  contact_email text,
  contact_phone text,
  contact_address text,
  social_links jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  chat_enabled boolean DEFAULT true,
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  linkedin_url text,
  twitter_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.threads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  tags ARRAY DEFAULT '{}'::text[],
  author_name text NOT NULL,
  author_email text,
  is_approved boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  like_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_featured boolean DEFAULT false,
  user_id uuid,
  CONSTRAINT threads_pkey PRIMARY KEY (id),
  CONSTRAINT threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.public_users(id)
);
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  endpoint_url text NOT NULL,
  inputs jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  category text,
  content text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  slug text UNIQUE,
  CONSTRAINT tools_pkey PRIMARY KEY (id)
);