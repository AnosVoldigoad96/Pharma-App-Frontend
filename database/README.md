# Database Setup Guide

This directory contains all SQL files for the ePharmatica database, organized by type.

## Directory Structure

```
database/
├── migrations/          # Database migrations (run in order)
├── functions/          # Database functions and procedures
├── test-data/          # Sample/test data for development
└── README.md           # This file
```

## Quick Start

### 1. Initial Setup

Run the migrations in numerical order:

```sql
-- 1. Create core schema (all tables, indexes, triggers)
\i database/migrations/001_initial_schema.sql

-- 2. Add about_us table
\i database/migrations/002_about_us_table.sql

-- 3. Add blog author fields
\i database/migrations/003_blog_author.sql

-- 4. Add chat history
\i database/migrations/004_chat_history.sql

-- 5. Add features table
\i database/migrations/005_features_table.sql

-- 6. Add contact info to site_settings
\i database/migrations/006_contact_info.sql

-- 7. Set up Row Level Security policies
\i database/migrations/007_rls_policies.sql

-- 8. Update color scheme structure
\i database/migrations/008_color_scheme_update.sql
```

### 2. Enable pgvector Extension

Required for AI chatbot RAG (Retrieval-Augmented Generation):

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Create Database Functions

```sql
-- RAG function for book content matching
\i database/functions/match_book_content.sql
```

### 4. Load Test Data (Optional)

For development/testing purposes:

```sql
\i database/test-data/threads.sql
\i database/test-data/comments.sql
```

## Using Supabase Dashboard

### Method 1: SQL Editor (Recommended)

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy contents from each migration file
5. Click **Run** (or Ctrl+Enter)
6. Run migrations in order (001 → 002 → 003 ...)

### Method 2: Database Migrations (Advanced)

If using Supabase CLI:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db reset
```

## Migration Order

**IMPORTANT**: Always run migrations in numerical order!

1. `001_initial_schema.sql` - Must run first (creates all core tables)
2. `002_about_us_table.sql` - Adds about_us table
3. `003_blog_author.sql` - Adds author info to blogs
4. `004_chat_history.sql` - Adds chat history tracking
5. `005_features_table.sql` - Adds features management
6. `006_contact_info.sql` - Adds contact fields to site_settings
7. `007_rls_policies.sql` - Sets up security policies
8. `008_color_scheme_update.sql` - Updates theme color structure

## Required Extensions

The following PostgreSQL extensions must be enabled:

- `uuid-ossp` - UUID generation (auto-enabled in 001_initial_schema.sql)
- `pgcrypto` - Cryptographic functions (auto-enabled in 001_initial_schema.sql)
- `vector` - Vector similarity search for AI chatbot (enable manually)

## Tables Created

### Core Tables
- `site_settings` - Global site configuration
- `public_users` - User profiles and permissions
- `seo_metadata` - SEO data for pages

### Content Tables
- `books` - Book library
- `book_categories` - Book categorization
- `book_knowledge` - RAG knowledge base for AI chatbot
- `blogs` - Blog articles
- `threads` - Community discussions
- `comments` - Thread comments
- `tools` - Pharmaceutical calculators/tools
- `faqs` - Frequently asked questions
- `page_content` - Dynamic page content

### Feature Tables
- `chatbots` - AI chatbot configurations
- `chat_messages` - Chat message history
- `chat_history` - Saved chat sessions
- `team_members` - Team member profiles
- `contact_submissions` - Contact form submissions
- `requests` - User feature requests
- `features` - Homepage features showcase
- `about_us` - About page content

## Functions

### `match_book_content()`

Vector similarity search for RAG chatbot.

**Parameters:**
- `query_embedding` (vector[768]) - HuggingFace embedding vector
- `target_book_id` (uuid) - Book to search within
- `match_threshold` (float) - Similarity threshold (default: 0.4)
- `match_count` (int) - Max results to return (default: 4)

**Returns:** Table with id, content, and similarity score

**Usage:**
```sql
SELECT * FROM match_book_content(
  query_embedding := '[0.1, 0.2, ...]'::vector(768),
  target_book_id := 'book-uuid-here',
  match_threshold := 0.5,
  match_count := 5
);
```

## Row Level Security (RLS)

Migration `007_rls_policies.sql` sets up security policies:

- **Public read access**: Books, blogs (published only), threads (approved only)
- **Authenticated write**: Comments, thread creation, profile updates
- **Admin-only**: All admin tables, approval workflows
- **User-specific**: Chat history (users see only their own)

## Troubleshooting

### Error: "extension vector does not exist"

**Solution:** Enable pgvector extension first:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Error: "relation X does not exist"

**Solution:** Run migrations in order. You likely skipped `001_initial_schema.sql`.

### Error: "type vector does not exist"

**Solution:** The pgvector extension is not enabled. Contact Supabase support or enable it in your project settings.

### Error: "duplicate key value violates unique constraint"

**Solution:** You're trying to re-run a migration. Migrations should only be run once. If you need to reset, drop the database and start over.

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in a development/staging environment first
3. **Run in order** - migrations are numbered for a reason
4. **One-way migrations** - these migrations are not reversible, plan accordingly
5. **Version control** - keep all SQL files in version control

## Need Help?

- Check `docs/database/SCHEMA.md` for complete table documentation
- Review `docs/database/MIGRATIONS_GUIDE.md` for advanced migration strategies
- See individual migration files for detailed comments

## Production Deployment

For production deployments:

1. Create a backup of your current database
2. Test all migrations on a staging database first
3. Run migrations during low-traffic periods
4. Monitor logs for any errors
5. Have a rollback plan ready

## Development Workflow

For local development:

```bash
# 1. Start local Supabase
supabase start

# 2. Run migrations
supabase db reset

# 3. Load your schema
cat database/migrations/*.sql | psql $DATABASE_URL

# 4. (Optional) Load test data
cat database/test-data/*.sql | psql $DATABASE_URL
```
