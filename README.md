# ePharmatica Frontend

A modern, full-featured pharmaceutical knowledge platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

- 📚 **Books Library** - Browse and search pharmaceutical books with AI-powered chat
- 📝 **Blog System** - Publish articles with SEO optimization and author management
- 💬 **Community Discussions** - Threaded discussions with moderation
- 🤖 **AI Chatbot** - RAG-powered chatbot for pharmaceutical questions
- 🛠️ **Tools & Calculators** - Pharmaceutical calculation tools and utilities
- 👥 **User Management** - Authentication, profiles, and role-based access
- 🎨 **Dynamic Theming** - Supabase theme with light/dark modes
- 📧 **Contact & Requests** - Contact forms and feature request system
- 🔒 **Admin CMS** - Complete admin dashboard for content management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase project ([create one free](https://supabase.com))
- Gemini API key for chatbot ([get it here](https://ai.google.dev))

### Installation

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd Frontend
   npm install
   ```

2. **Set up environment variables:**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   HUGGINGFACE_API_KEY=your_huggingface_key  # For RAG embeddings
   ```
   
   See **[docs/setup/ENVIRONMENT.md](docs/setup/ENVIRONMENT.md)** for detailed instructions.

3. **Set up database:**
   
   Run migrations in order (see **[database/README.md](database/README.md)**):
   ```sql
   -- In Supabase SQL Editor, run each file:
   database/migrations/001_initial_schema.sql
   database/migrations/002_about_us_table.sql
   database/migrations/003_blog_author.sql
   -- ... (continue in order)
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Documentation

### Setup Guides
- **[Installation Guide](docs/setup/ENVIRONMENT.md)** - Environment setup and configuration
- **[Database Setup](database/README.md)** - Complete database migration guide
- **[Database Schema](docs/database/SCHEMA.md)** - Full schema reference

### Feature Documentation
- **[Authentication System](docs/features/AUTHENTICATION.md)** - User auth and profiles
- **[AI Chatbot & RAG](docs/features/CHATBOT.md)** - Chatbot configuration and RAG setup
- **[Tools System](docs/features/TOOLS.md)** - Creating pharmaceutical calculators
- **[Theming Guide](docs/features/THEMING.md)** - Theme customization and styling

### Additional Resources
- **[Supabase Theme Implementation](SUPABASE_THEME_IMPLEMENTATION.md)** - Theme setup details
- **[Color Reference](THEME_COLOR_REFERENCE.md)** - Complete color palette

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS v4  
- **UI Components:** shadcn/ui  
- **Database:** Supabase (PostgreSQL)  
- **Authentication:** Supabase Auth  
- **AI:** Google Gemini API  
- **Vector Search:** pgvector (for RAG)  
-  **Deployment:** Vercel  
- **Icons:** Lucide React  

## 📁 Project Structure

```
Frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── admin/             # Admin CMS pages
│   ├── api/               # API routes
│   ├── blogs/             # Blog pages
│   ├── books/             # Book library pages
│   ├── threads/           # Discussion forum
│   ├── tools/             # Pharmaceutical tools
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles & theme
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── footer.tsx        # Footer component
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients & queries
│   ├── theme-utils.ts    # Theme utilities
│   └── utils.ts          # General utilities
├── database/              # SQL files
│   ├── migrations/       # Database migrations
│   ├── functions/        # Database functions
│   └── test-data/        # Sample data
├── docs/                  # Documentation
│   ├── setup/            # Setup guides
│   ├── features/         # Feature documentation
│   └── database/         # Database docs
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## 📊 Database

### Core Tables

- `site_settings` - Global configuration
- `public_users` - User profiles and roles
- `books` / `book_categories` - Book library
- `book_knowledge` - RAG knowledge base
- `blogs` - Blog articles
- `threads` / `comments` - Community discussions
- `tools` - Pharmaceutical calculators
- `chatbots` / `chat_history` - AI chatbot
- `contact_submissions` / `requests` - User communications
- `team_members` / `faqs` / `features` - CMS content

See **[docs/database/SCHEMA.md](docs/database/SCHEMA.md)** for complete schema documentation.

## 🎨 Theming

The project uses the **Supabase theme** with OKLCH color space for perceptually uniform colors:

```tsx
// Use theme-aware utilities
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>

<div className="bg-card text-card-foreground border border-border rounded-lg">
  Card content
</div>
```

**Dark mode** is automatically supported. Add ThemeProvider to toggle:

```tsx
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

See **[docs/features/THEMING.md](docs/features/THEMING.md)** for customization guide.

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤖 AI Chatbot Setup

1. **Enable pgvector extension** in Supabase
2. **Run database function:**
   ```sql
   \i database/functions/match_book_content.sql
   ```
3. **Add API keys** to `.env.local`
4. **Configure chatbots** in admin panel or database

See **[docs/features/CHATBOT.md](docs/features/CHATBOT.md)** for detailed setup.

## 🛠️ Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are added to `components/ui/` and automatically use your theme.

## 📝 Creating Content

### Admin Access

Navigate to `/admin` (requires admin role).

### Adding Books

1. Go to **Admin → Books**
2. Click **Add Book**
3. Fill in details, upload cover
4. Enable AI chat if RAG is set up

### Creating Blog Posts

1. Go to **Admin → Blogs**
2. Click **Create Post**
3. Write content (supports Markdown/HTML)
4. Set SEO metadata
5. Publish when ready

### Pharmaceutical Tools

1. Go to **Admin → Tools**
2. Click **Create Tool**
3. Define inputs (JSON schema)
4. Set API endpoint for calculations

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** (user, moderator, admin)
- **Content moderation** for threads and comments
- **Secure API routes** with authentication checks

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
HUGGINGFACE_API_KEY=
```

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (light/dark modes, mobile/desktop)
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review database schema
- Check feature flags in `lib/theme-config.ts` and `lib/chat-config.ts`

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Google Gemini API](https://ai.google.dev/docs)

---

**Built with ❤️ for the pharmaceutical community**
