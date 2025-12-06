# Blog Author Setup Instructions

## Overview
This migration adds author support to blogs by linking them to user profiles in the `public_users` table.

## What This Migration Does

1. **Adds `user_id` column** to `blogs` table
   - Type: `uuid` (nullable)
   - Links each blog to its author in `public_users` table

2. **Creates foreign key constraint**
   - Ensures data integrity
   - Automatically sets `user_id` to NULL if author is deleted

3. **Creates index** for better query performance

4. **Adds documentation** via SQL comment

## How to Run

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `lib/supabase/blog-author-migration.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
supabase db push
```

Or if you have the SQL file:

```bash
psql -h your-db-host -U postgres -d postgres -f lib/supabase/blog-author-migration.sql
```

## After Migration

### For Existing Blogs
- Existing blogs will have `user_id = NULL` (no author)
- You can manually update them in the Supabase dashboard or via SQL:

```sql
-- Example: Assign all existing blogs to a specific user
UPDATE public.blogs
SET user_id = 'user-uuid-here'
WHERE user_id IS NULL;
```

### For New Blogs
- When creating blogs in your CMS, make sure to set the `user_id` field
- The frontend will automatically fetch and display author information

## Verification

After running the migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs' AND column_name = 'user_id';

-- Check if foreign key exists
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'blogs'
  AND kcu.column_name = 'user_id';
```

## Frontend Integration

The frontend is already set up to:
- ✅ Fetch author information from `public_users` table
- ✅ Display author name and avatar in blog listings
- ✅ Display author name and avatar in blog detail pages
- ✅ Show author in sidebar "Other Blogs" section
- ✅ Handle cases where author doesn't exist (graceful fallback)

## Troubleshooting

### Error: "column user_id already exists"
- The column already exists, you can skip Step 1 or use `IF NOT EXISTS`

### Error: "foreign key constraint already exists"
- The constraint already exists, you can skip Step 2 or drop it first:
  ```sql
  ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_user_id_fkey;
  ```

### Blogs not showing author
- Check if `user_id` is set in the blogs table
- Verify the user exists in `public_users` table
- Check browser console for any errors

## Next Steps

1. Run the migration SQL
2. Update existing blogs to assign authors (optional)
3. Ensure your CMS sets `user_id` when creating new blogs
4. Test the frontend to see author names displayed

