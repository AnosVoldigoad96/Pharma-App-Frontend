# ePharmatica Frontend

A modern Next.js frontend application for the ePharmatica pharmaceutical knowledge platform, built with TypeScript, Tailwind CSS, and Supabase.

## Features

- 📚 **Books Library** - Browse and search pharmaceutical books
- 📝 **Blog Articles** - Read the latest pharmaceutical news and insights
- 💬 **Community Discussions** - Join threads and discussions
- 🛠️ **Tools** - Access pharmaceutical tools and utilities
- 📧 **Contact Form** - Submit inquiries and feedback
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project with the database schema set up

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   See `ENV_SETUP.md` for detailed instructions on how to get these values.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── books/             # Books pages
│   ├── blogs/             # Blog pages
│   ├── threads/           # Discussion threads
│   └── contact/           # Contact page
├── components/            # React components
│   └── navigation.tsx     # Main navigation
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase configuration
│   │   ├── client.ts     # Supabase client
│   │   ├── types.ts      # TypeScript types
│   │   └── queries.ts    # Data fetching functions
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

## Database Schema

The application uses the following main tables from Supabase:

- `blogs` - Blog articles
- `books` - Book library
- `book_categories` - Book categories
- `threads` - Discussion threads
- `comments` - Thread comments
- `tools` - Tools and utilities
- `faqs` - Frequently asked questions
- `team_members` - Team member profiles
- `contact_submissions` - Contact form submissions
- `site_settings` - Site configuration
- And more...

See `Supabase_Database.md` for the complete database schema.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Data Fetching

All data fetching functions are located in `lib/supabase/queries.ts`. These functions use the Supabase client to fetch data from your database.

Example usage:
```typescript
import { getBooks, getBlogs } from '@/lib/supabase/queries'

// In a Server Component
const { data: books, error } = await getBooks(10, undefined, true)
```

## TypeScript Types

All database types are defined in `lib/supabase/types.ts`. Import them as needed:

```typescript
import type { Book, Blog, Thread } from '@/lib/supabase/types'
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private project - All rights reserved
