-- Fix RLS (Row Level Security) for public_users table
-- This allows the frontend to read author information from public_users

-- Step 1: Check if RLS is enabled (run this first to check)
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'public_users';

-- Step 2: Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to public_users" ON public.public_users;

-- Step 3: Create a policy to allow public read access
-- This allows anyone to read public_users data (for displaying author names)
CREATE POLICY "Allow public read access to public_users"
ON public.public_users
FOR SELECT
TO public
USING (true);

-- Alternative: If you want more restrictive access, you can use:
-- DROP POLICY IF EXISTS "Allow authenticated users to read public_users" ON public.public_users;
-- CREATE POLICY "Allow authenticated users to read public_users"
-- ON public.public_users
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- Step 4: Verify the policy was created
-- SELECT * FROM pg_policies WHERE tablename = 'public_users';

-- Note: If RLS is not enabled on public_users, you don't need these policies
-- To check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'public_users';
-- If rowsecurity is false, RLS is not enabled and policies won't apply

