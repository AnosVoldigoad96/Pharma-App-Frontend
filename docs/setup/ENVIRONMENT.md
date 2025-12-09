# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
# Google AI Studio (Gemini) - Get from https://aistudio.google.com/app/apikey
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Groq API - Get from https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key
```

## How to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and paste it as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## How to get your AI API keys:

### Google AI Studio (Gemini):
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and paste it as `GOOGLE_AI_API_KEY`

### Groq:
1. Go to https://console.groq.com/keys
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it as `GROQ_API_KEY`

**Important:** Never commit your `.env.local` file to version control!

