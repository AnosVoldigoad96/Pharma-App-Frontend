-- Migration: Add user_id (author) to blogs table
-- This allows blogs to be linked to user profiles for author information

-- Step 1: Add user_id column to blogs table (nullable for existing blogs)
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Step 2: Add foreign key constraint to link blogs to public_users
-- This creates the relationship: blogs.user_id -> public_users.id
ALTER TABLE public.blogs
ADD CONSTRAINT blogs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.public_users(id) 
ON DELETE SET NULL;

-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON public.blogs(user_id);

-- Step 4: Add comment to document the column
COMMENT ON COLUMN public.blogs.user_id IS 'References public_users.id - the author/creator of the blog post';

-- Optional: If you want to update existing blogs to have a default author
-- (Uncomment and modify as needed)
-- UPDATE public.blogs
-- SET user_id = (SELECT id FROM public.public_users WHERE role = 'admin' LIMIT 1)
-- WHERE user_id IS NULL;

