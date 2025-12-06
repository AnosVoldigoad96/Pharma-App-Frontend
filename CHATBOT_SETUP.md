# Chatbot Setup Guide

This guide explains how to set up the universal chatbot system with RAG (Retrieval Augmented Generation), matching the CMS implementation.

## Overview

The chatbot system supports:
- **Multiple AI Models**: Google AI Studio (Gemini) and Groq
- **RAG Retrieval**: Uses Google's `text-embedding-004` model to find relevant book knowledge
- **Universal Configuration**: Works with any chatbot configuration from the `chatbots` table
- **CMS Compatible**: Matches the exact implementation used in the CMS admin panel

## Prerequisites

1. **API Keys**:
   - Google AI Studio API key (for Gemini models and `text-embedding-004` embeddings)
   - Groq API key (for Groq models)

2. **Database Setup**:
   - `chatbots` table with `model_name`, `system_prompt`, and `linked_book_id`
   - `book_knowledge` table with `book_id`, `content`, and `embedding` columns (vector type)
   - `match_book_content` RPC function for vector similarity search

## Environment Variables

Add these to your `.env.local`:

```env
# AI API Keys
GOOGLE_AI_API_KEY=your_google_ai_api_key
GROQ_API_KEY=your_groq_api_key

# Optional: Supabase Service Role Key (for better permissions)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

### 1. Enable pgvector Extension

Run this in your Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Vector Search Function

Run the SQL from `lib/supabase/functions.sql` in your Supabase SQL editor. This creates the `match_book_content` function for vector similarity search (matching the CMS implementation).

**Note**: If you haven't set up vector search yet, the system will automatically fall back to retrieving knowledge by `book_id` without vector similarity.

### 3. Prepare Book Knowledge Data

Ensure your `book_knowledge` table has:
- `book_id`: Links to the book
- `content`: The knowledge text
- `embedding`: Vector embeddings (768 dimensions for Google's `text-embedding-004`)

To generate embeddings, you can use the Google Embedding API (`text-embedding-004`) or your CMS system.

## Model Configuration

### Supported Models

**Google AI Studio (Gemini)**:
- `gemini-2.0-flash-lite-preview-02-05` (default)
- `gemini-2.0-flash`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- Any Gemini model name

**Groq**:
- `llama-3.3-70b-versatile`
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`
- Any Llama/Mixtral model name

### Model Detection

The system automatically detects which API to use based on the `model_name` in the `chatbots` table:
- Models containing "llama", "mixtral", or "groq" → Groq API
- All others → Google AI Studio (Gemini)

## How It Works

1. **User sends a message** → Frontend calls `/api/chat` with `messages` array and `botId`
2. **Fetch chatbot config** → Retrieves bot settings from `chatbots` table
3. **RAG Process** (if `linked_book_id` exists):
   - **Embed query** → Last user message is converted to a vector using `text-embedding-004`
   - **Vector search** → Calls `match_book_content` RPC function to find relevant chunks
   - **Context injection** → Appends retrieved chunks to `system_prompt`
4. **Model inference** → Based on `model_name`, calls either Google AI (Gemini) or Groq API
5. **Return response** → AI response with debug info (model used, RAG status)

## API Format

The API expects:
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "What is..." }
  ],
  "botId": "uuid-of-chatbot"
}
```

Response:
```json
{
  "message": "AI response text",
  "model": "gemini-2.0-flash-lite-preview-02-05",
  "usedRAG": true
}
```

## Testing

1. Ensure a chatbot exists in the `chatbots` table with:
   - `linked_book_id` pointing to a book
   - `model_name` set to a supported model
   - `system_prompt` configured

2. Ensure `book_knowledge` entries exist for that book

3. Open the chat page for a book with `ai_chat_enabled = true`

4. Send a message and verify:
   - The message is processed
   - Relevant knowledge is retrieved (check console logs)
   - AI response is generated

## Troubleshooting

### "GOOGLE_AI_API_KEY is not configured"
- Add `GOOGLE_AI_API_KEY` to your `.env.local`

### "GROQ_API_KEY is not configured"
- Add `GROQ_API_KEY` to your `.env.local`
- Or use a Google AI model instead

### "Vector search not available"
- This is normal if you haven't set up the `match_book_knowledge` function
- The system will automatically use fallback retrieval by `book_id`

### "No response generated"
- Check that the model name in `chatbots` table is correct
- Verify API keys are valid
- Check browser console and server logs for errors

## Customization

### Adding New Models

Edit `app/api/chat/route.ts`:
- Add detection logic in the model selection section
- Add a new API call function if needed

### Adjusting RAG Parameters

In `app/api/chat/route.ts`, modify the `retrieveRelevantKnowledge` function call:
- `match_threshold`: Similarity threshold (default: 0.4, matching CMS)
- `match_count`: Number of knowledge chunks to retrieve (default: 4, matching CMS)

### Changing Embedding Model

The system uses `text-embedding-004` (matching CMS). To change, update the `getEmbedding` function in `app/api/chat/route.ts`:
```typescript
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
```


