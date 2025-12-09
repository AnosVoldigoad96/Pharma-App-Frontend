# Database Schema Documentation

Complete reference for all database tables in the ePharmatica platform.

## Table of Contents

1. [Core Tables](#core-tables)
2. [Content Management](#content-management)
3. [User & Community](#user--community)
4. [AI & Chatbot](#ai--chatbot)
5. [CMS & Admin](#cms--admin)
6. [Relationships](#relationships)

---

## Core Tables

### `site_settings`

Global site configuration and branding.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `brand_name` | TEXT | Site name (default: 'ePharmatica') |
| `brand_logo` | TEXT | URL to brand logo image |
| `colors` | JSONB | Theme colors (light/dark modes) |
| `contact_email` | TEXT | Primary contact email |
| `contact_phone` | TEXT | Contact phone number |
| `contact_address` | TEXT | Physical address |
| `social_links` | JSONB | Array of social media links |
| `chat_enabled` | BOOLEAN | Enable/disable chatbot feature |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Notes:** Only one row should exist. Colors support both single theme and dual light/dark structure.

### `seo_metadata`

SEO configuration for pages.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `page_slug` | TEXT | Unique page identifier |
| `meta_title` | TEXT | Page title for SEO |
| `meta_description` | TEXT | Page description |
| `keywords` | TEXT | SEO keywords |
| `og_image` | TEXT | Open Graph image URL |
| `canonical_url` | TEXT | Canonical URL |
| `robots` | TEXT | Robots directive (default: 'index, follow') |
| `structured_data` | JSONB | Schema.org structured data |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Content Management

### `books`

Pharmaceutical book library.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Book title |
| `author` | TEXT | Book author(s) |
| `edition` | TEXT | Edition information |
| `category_id` | UUID | Foreign key → `book_categories.id` |
| `tags` | TEXT[] | Array of tags |
| `cover_image` | TEXT | Cover image URL |
| `pdf_url` | TEXT | PDF file URL |
| `purchase_link` | TEXT | External purchase link |
| `isbn` | TEXT | ISBN number |
| `ai_chat_enabled` | BOOLEAN | Enable AI chatbot for this book |
| `seo_id` | UUID | Foreign key → `seo_metadata.id` |
| `is_featured` | BOOLEAN | Display on homepage |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:** `category_id`, `is_featured`, `created_at`

### `book_categories`

Book categorization.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Category name (unique) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### `book_knowledge`

RAG knowledge base for AI chatbot (requires pgvector extension).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `book_id` | UUID | Foreign key → `books.id` |
| `content` | TEXT | Text chunk from book |
| `embedding` | VECTOR(768) | HuggingFace embedding vector |

**Indexes:** `embedding` (ivfflat vector_cosine_ops)

### `blogs`

Blog articles and news.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Article title |
| `subtitle` | TEXT | Article subtitle |
| `slug` | TEXT | URL-friendly slug (unique) |
| `excerpt` | TEXT | Short summary |
| `content` | TEXT | Full article content (HTML/Markdown) |
| `cover_image` | TEXT | Cover image URL |
| `is_published` | BOOLEAN | Publish status |
| `is_featured` | BOOLEAN | Feature on homepage |
| `meta_title` | TEXT | SEO title |
| `meta_description` | TEXT | SEO description |
| `meta_keywords` | TEXT[] | SEO keywords array |
| `og_image` | TEXT | Open Graph image |
| `user_id` | UUID | Foreign key → `public_users.user_id` (author) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:** `slug`, `is_published`, `user_id`, `created_at`

### `tools`

Pharmaceutical calculators and utilities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Tool name |
| `slug` | TEXT | URL-friendly slug (unique) |
| `description` | TEXT | Tool description |
| `category` | TEXT | Tool category |
| `endpoint_url` | TEXT | API endpoint for calculation |
| `inputs` | JSONB | Input field definitions |
| `content` | TEXT | Additional content/instructions |
| `seo_title` | TEXT | SEO title |
| `seo_description` | TEXT | SEO description |
| `seo_keywords` | TEXT | SEO keywords |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Indexes:** `slug`, `category`

**Input Schema Example:**
```json
[
  {
    "name": "weight",
    "label": "Weight (kg)",
    "type": "number",
    "required": true
  }
]
```

---

## User & Community

### `public_users`

User profiles and roles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → `auth.users.id` |
| `email` | TEXT | User email (unique) |
| `full_name` | TEXT | Full name |
| `avatar_url` | TEXT | Profile picture URL |
| `role` | TEXT | Role: 'user', 'admin', or 'moderator' |
| `occupation` | TEXT | User occupation |
| `phone` | TEXT | Phone number |
| `gender` | TEXT | Gender |
| `age` | INTEGER | Age |
| `is_banned` | BOOLEAN | Ban status |
| `ban_expires_at` | TIMESTAMPTZ | Ban expiration (null = permanent) |
| `ban_reason` | TEXT | Reason for ban |
| `created_at` | TIMESTAMPTZ | Registration timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `threads`

Community discussion threads.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Thread title |
| `slug` | TEXT | URL-friendly slug (unique) |
| `content` | TEXT | Thread content |
| `tags` | TEXT[] | Tags array |
| `author_name` | TEXT | Author display name |
| `author_email` | TEXT | Author email |
| `user_id` | UUID | Foreign key → `public_users.user_id` |
| `is_approved` | BOOLEAN | Moderation approval status |
| `is_locked` | BOOLEAN | Locked (no new comments) |
| `is_featured` | BOOLEAN | Featured thread |
| `like_count` | INTEGER | Number of likes |
| `view_count` | INTEGER | View count |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:** `slug`, `is_approved`, `user_id`, `created_at`

### `comments`

Threaded comments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `thread_id` | UUID | Foreign key → `threads.id` |
| `content` | TEXT | Comment content |
| `author_name` | TEXT | Author display name |
| `user_id` | UUID | Foreign key → `public_users.user_id` |
| `is_approved` | BOOLEAN | Moderation approval status |
| `like_count` | INTEGER | Number of likes |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Indexes:** `thread_id`, `user_id`, `created_at`

---

## AI & Chatbot

### `chatbots`

AI chatbot configurations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Chatbot name |
| `description` | TEXT | Chatbot description |
| `system_prompt` | TEXT | System instructions for AI |
| `model_name` | TEXT | AI model (default: 'gemini-1.5-pro') |
| `linked_book_id` | UUID | Foreign key → `books.id` (for RAG) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### `chat_history`

Saved chat conversations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → `auth.users.id` |
| `chatbot_id` | UUID | Foreign key → `chatbots.id` |
| `title` | TEXT | Conversation title |
| `messages` | JSONB | Array of message objects |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:** `user_id`, `chatbot_id`

**Message Schema:**
```json
[
  {
    "role": "user",
    "content": "What is amoxicillin?",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  {
    "role": "assistant",
    "content": "Amoxicillin is...",
    "timestamp": "2024-01-01T12:00:05Z"
  }
]
```

### `chat_messages`

Simple chat message storage.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User ID |
| `content` | TEXT | Message content |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

---

## CMS & Admin

### `team_members`

Team member profiles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Member name |
| `role` | TEXT | Job title/role |
| `bio` | TEXT | Biography |
| `image_url` | TEXT | Profile photo URL |
| `linkedin_url` | TEXT | LinkedIn profile |
| `twitter_url` | TEXT | Twitter/X profile |
| `display_order` | INTEGER | Sort order |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `faqs`

Frequently asked questions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `question` | TEXT | Question text |
| `answer` | TEXT | Answer text (HTML supported) |
| `display_order` | INTEGER | Sort order |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `contact_submissions`

Contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Sender name |
| `email` | TEXT | Sender email |
| `subject` | TEXT | Message subject |
| `message` | TEXT | Message content |
| `status` | TEXT | Status: 'new', 'read', or 'replied' |
| `created_at` | TIMESTAMPTZ | Submission timestamp |

### `requests`

Feature/content requests from users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `type` | TEXT | Type: 'book', 'tool', or 'other' |
| `title` | TEXT | Request title |
| `description` | TEXT | Detailed description |
| `user_name` | TEXT | Requester name |
| `user_email` | TEXT | Requester email |
| `status` | TEXT | Status: 'pending', 'approved', 'rejected', 'fulfilled' |
| `created_at` | TIMESTAMPTZ | Request timestamp |

### `page_content`

Dynamic page content.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `page_slug` | TEXT | Page identifier (unique) |
| `hero_section` | JSONB | Hero/banner section data |
| `content` | JSONB | Page content blocks |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `features`

Homepage feature showcase.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Feature title |
| `description` | TEXT | Feature description |
| `image` | TEXT | Feature image URL |
| `display_order` | INTEGER | Sort order |
| `is_active` | BOOLEAN | Show/hide feature |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `about_us`

About page content.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `mission_title` | TEXT | Mission section title |
| `mission_content` | TEXT | Mission content |
| `vision_title` | TEXT | Vision section title |
| `vision_content` | TEXT | Vision content |
| `features_section_title` | TEXT | Features section title |
| `features_section_subtitle` | TEXT | Features subtitle |
| `features` | JSONB | Array of feature objects |
| `values_section_title` | TEXT | Values section title |
| `values_section_subtitle` | TEXT | Values subtitle |
| `values` | JSONB | Array of value objects |
| `cta_heading` | TEXT | CTA heading |
| `cta_description` | TEXT | CTA description |
| `cta_primary_button_text` | TEXT | Primary button text |
| `cta_primary_button_link` | TEXT | Primary button link |
| `cta_secondary_button_text` | TEXT | Secondary button text |
| `cta_secondary_button_link` | TEXT | Secondary button link |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Relationships

### Entity Relationship Diagram

```
auth.users (Supabase Auth)
    ↓
public_users (1:1)
    ├── blogs (1:n) - author relationship
    ├── threads (1:n) - author relationship
    └── comments (1:n) - author relationship

book_categories
    └── books (1:n)
        ├── book_knowledge (1:n) - RAG embeddings
        └── chatbots (1:1) - linked book

chatbots
    └── chat_history (1:n)

threads
    └── comments (1:n)

seo_metadata
    └── books (1:1)
```

### Key Foreign Key Relationships

- `public_users.user_id` → `auth.users.id` (CASCADE DELETE)
- `books.category_id` → `book_categories.id` (SET NULL)
- `books.seo_id` → `seo_metadata.id` (SET NULL)
- `book_knowledge.book_id` → `books.id` (CASCADE DELETE)
- `blogs.user_id` → `public_users.user_id` (SET NULL)
- `threads.user_id` → `public_users.user_id` (SET NULL)
- `comments.thread_id` → `threads.id` (CASCADE DELETE)
- `comments.user_id` → `public_users.user_id` (SET NULL)
- `chatbots.linked_book_id` → `books.id` (SET NULL)
- `chat_history.user_id` → `auth.users.id` (CASCADE DELETE)
- `chat_history.chatbot_id` → `chatbots.id` (CASCADE DELETE)

---

## Database Functions

### `match_book_content()`

Vector similarity search for RAG chatbot.

```sql
CREATE FUNCTION match_book_content(
  query_embedding vector(768),
  target_book_id uuid,
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
```

See `database/functions/match_book_content.sql` for full implementation.

---

## Triggers

All tables with `updated_at` columns have an `UPDATE` trigger that automatically sets `updated_at = NOW()` on row updates.

Tables with auto-update triggers:
- site_settings
- public_users
- books
- blogs
- threads
- team_members
- faqs
- page_content
- features
- chat_history

---

## Migration History

1. **001_initial_schema.sql** - Core schema with all base tables
2. **002_about_us_table.sql** - About page CMS
3. **003_blog_author.sql** - Blog author fields
4. **004_chat_history.sql** - Chat history tracking
5. **005_features_table.sql** - Homepage features
6. **006_contact_info.sql** - Site settings contact fields
7. **007_rls_policies.sql** - Row Level Security
8. **008_color_scheme_update.sql** - Enhanced theme colors

See `database/README.md` for detailed migration instructions.
