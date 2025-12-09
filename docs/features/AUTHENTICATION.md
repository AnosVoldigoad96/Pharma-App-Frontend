# Authentication Setup Guide

This application uses Supabase Auth for secure user authentication.

## Features

- ✅ Secure signup with email/password
- ✅ Secure login with email/password
- ✅ Automatic profile creation in `public_users` table
- ✅ Session management with automatic refresh
- ✅ Protected routes
- ✅ User profile display in navigation
- ✅ Logout functionality

## Database Setup

### Required Tables

The `public_users` table should already exist in your database (see `Supabase_Database.md`).

### Optional: Database Trigger (Recommended)

For automatic profile creation when a user signs up, you can create a database trigger in Supabase:

**If the trigger doesn't exist yet:**

```sql
-- Function to create public_users record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.public_users (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**If the trigger already exists (to update it):**

```sql
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Function to create public_users record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.public_users (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Note:** 
- The application code also creates the profile record, so this trigger is optional but recommended for redundancy.
- If you see an error that the trigger already exists, you can either skip this step (the trigger is already working) or use the "update" SQL above to recreate it.
- The `ON CONFLICT DO NOTHING` clause prevents errors if the profile already exists.

## Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Authentication Flow

1. **Sign Up** (`/signup`):
   - User enters email, password, and optional full name
   - Account is created in Supabase Auth
   - Profile record is created in `public_users` table
   - User is redirected to login page

2. **Login** (`/login`):
   - User enters email and password
   - Session is created
   - User is redirected to home page
   - Navigation updates to show user info

3. **Session Management**:
   - Auth context automatically manages user session
   - Session persists across page refreshes
   - Automatic token refresh

4. **Logout**:
   - User clicks logout button
   - Session is destroyed
   - User is redirected to home page

## Protected Routes

To protect a route, use the `useAuth` hook:

```tsx
"use client";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

## User Profile

- Profile page: `/profile`
- Shows user information from `public_users` table
- Displays avatar, name, email, and other profile fields

## Security Features

- ✅ Password hashing (handled by Supabase)
- ✅ Secure session tokens
- ✅ Automatic token refresh
- ✅ Row Level Security (RLS) support
- ✅ Email verification (can be enabled in Supabase dashboard)

## Enabling Email Verification

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Enable email confirmations"
3. Configure email templates as needed

## Password Requirements

- Minimum 6 characters (enforced in frontend)
- Can be customized in Supabase Auth settings

## Troubleshooting

### Profile not created after signup
- Check Supabase logs for errors
- Verify `public_users` table has correct permissions
- Check that the insert query in `lib/auth.ts` is working

### Session not persisting
- Check browser cookies are enabled
- Verify environment variables are set correctly
- Check Supabase project settings

### User can't login
- Verify email/password are correct
- Check if email verification is required
- Check Supabase Auth logs for errors

