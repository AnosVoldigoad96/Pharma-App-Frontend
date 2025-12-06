# Quick Setup Guide

Follow these steps to get your ePharmatica frontend up and running:

## Step 1: Install Dependencies

If you haven't already, install all required packages:

```bash
npm install
```

## Step 2: Configure Supabase

1. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** and **anon public** key

2. **Create environment file:**
   - Create a file named `.env.local` in the root directory
   - Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Replace the placeholders:**
   - Replace `https://your-project.supabase.co` with your actual Project URL
   - Replace `your-anon-key-here` with your actual anon key

## Step 3: Start Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Verify Database Connection

The app will automatically fetch data from your Supabase database. Make sure:

1. Your database tables are created (as per `Supabase_Database.md`)
2. Row Level Security (RLS) policies allow public read access for:
   - `blogs` (where `is_published = true`)
   - `books`
   - `threads` (where `is_approved = true`)
   - `comments` (where `is_approved = true`)
   - `faqs`
   - `team_members`
   - `site_settings`
   - `tools`

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the root directory
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the development server after creating/updating `.env.local`

### No data showing on pages
- Check that your Supabase database has data in the tables
- Verify RLS policies allow public read access
- Check browser console for any errors

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check that TypeScript types match your database schema
- Verify environment variables are set correctly

## Next Steps

- Customize the home page in `app/page.tsx`
- Add more pages as needed
- Style components using Tailwind CSS
- Add shadcn/ui components: `npx shadcn@latest add [component-name]`

## Need Help?

Refer to:
- `README.md` - Full documentation
- `ENV_SETUP.md` - Environment setup details
- `Supabase_Database.md` - Database schema reference

