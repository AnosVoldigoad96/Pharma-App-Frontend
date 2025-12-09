# Chatbot & AI Documentation

This document covers the AI chatbot system with RAG (Retrieval-Augmented Generation) capabilities.

## Overview

The ePharmatica chatbot system uses Google's Gemini AI with optional RAG support for book-specific knowledge. The chatbot can answer pharmaceutical questions with enhanced accuracy when linked to book content.

## Architecture

```
User Question
    ↓
Frontend (Next.js)
    ↓
Vercel API Route (/api/chat)
    ↓
[Optional] RAG: Query book_knowledge table
    ↓
Gemini AI (with context)
    ↓
Response to User
```

## Database Tables

### `chatbots`

Stores chatbot configurations.

```typescript
{
  id: uuid
  name: string
  description: string
  system_prompt: string          // AI instructions
  model_name: string             // Default: 'gemini-1.5-pro'
  linked_book_id?: uuid          // Optional book for RAG
  created_at: timestamp
}
```

### `chat_history`

Stores user chat sessions (requires authentication).

```typescript
{
  id: uuid
  user_id: uuid                  // Foreign key to auth.users
  chatbot_id: uuid               // Foreign key to chatbots
  title: string                  // Session title
  messages: jsonb                // Array of messages
  created_at: timestamp
  updated_at: timestamp
}
```

**Message Format:**
```json
[
  {
    "role": "user",
    "content": "What is the dosage for amoxicillin?",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  {
    "role": "assistant",
    "content": "The typical dosage for amoxicillin...",
    "timestamp": "2024-01-01T12:00:05Z"
  }
]
```

### `book_knowledge`

Stores embedded book content for RAG (requires pgvector extension).

```typescript
{
  id: uuid
  book_id: uuid                  // Foreign key to books
  content: text                  // Text chunk (typically 500-1000 chars)
  embedding: vector(768)         // HuggingFace embedding
}
```

## RAG (Retrieval-Augmented Generation)

### How It Works

1. **Question Embedding**: User's question is converted to a 768-dimensional vector using HuggingFace models
2. **Similarity Search**: Vector is compared against `book_knowledge.embedding` using cosine similarity
3. **Context Retrieval**: Top matching chunks (default: 4) are retrieved
4. **Prompt Enhancement**: Retrieved context is added to the AI prompt
5. **Response Generation**: Gemini generates answer with book-specific knowledge

### Database Function

The `match_book_content` function performs vector similarity search:

```sql
SELECT * FROM match_book_content(
  query_embedding := embedding_vector,
  target_book_id := 'book-uuid',
  match_threshold := 0.4,    -- Minimum similarity (0.0-1.0)
  match_count := 4           -- Max results
);
```

**Returns:**
```typescript
{
  id: uuid,
  content: string,
  similarity: number  // 0.0 to 1.0 (higher = more similar)
}[]
```

### Setup Requirements

1. **Enable pgvector extension:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Create database function:**
   ```bash
   # Run the SQL file in Supabase SQL Editor
   database/functions/match_book_content.sql
   ```

3. **Populate book_knowledge table** with embedded content (requires external processing)

## Feature Flags

### Chat History Feature

Located in `lib/chat-config.ts`:

```typescript
export const ENABLE_CHAT_HISTORY = true;  // Enable/disable history
```

**When enabled:**
- Users can save chat sessions
- Previous conversations are accessible
- Requires authentication

**When disabled:**
- Chatbot works without authentication
- No conversation persistence
- Simpler UX for anonymous users

## API Integration

### Environment Variables

Add to `.env.local`:

```env
# Required for chatbot
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Required for RAG embeddings
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### API Route

`app/api/chat/route.ts` handles chat requests:

```typescript
POST /api/chat
{
  message: string
  chatbotId?: string   // Optional: use specific chatbot
  bookId?: string      // Optional: enable RAG for this book
}

Response:
{
  response: string
  error?: string
}
```

## Chatbot Configuration

### Creating a Chatbot

Via Supabase dashboard or admin panel:

```sql
INSERT INTO chatbots (name, description, system_prompt, linked_book_id)
VALUES (
  'Pharmacology Assistant',
  'Expert in pharmaceutical sciences',
  'You are a pharmaceutical expert. Provide accurate, evidence-based answers...',
  'book-uuid-here'  -- Optional
);
```

### Best Practices for System Prompts

1. **Be Specific**: Define the chatbot's expertise area
2. **Set Boundaries**: Clarify what it should/shouldn't answer
3. **Tone & Style**: Specify how formal/technical responses should be
4. **Safety**: Include medical disclaimer if needed

**Example:**
```
You are a pharmaceutical knowledge assistant specializing in drug information.

GUIDELINES:
- Provide evidence-based, accurate information
- Cite sources when possible
- Always include medical disclaimer
- Do not provide personalized medical advice
- Recommend consulting healthcare professionals for specific cases

TONE: Professional, educational, clear
```

## Frontend Components

### `ChatInterface` Component

Primary chat UI component.

**Props:**
```typescript
{
  chatbotId?: string
  bookId?: string
  enableHistory?: boolean
}
```

**Location:** `components/chat-interface.tsx`

## Chat History Management

### Saving Conversations

```typescript
// Automatically saved when ENABLE_CHAT_HISTORY = true
// User must be authenticated
```

### Loading Previous Chats

```typescript
import { getChatHistory } from '@/lib/supabase/queries'

const history = await getChatHistory(userId)
// Returns array of chat sessions
```

### Deleting Chat History

```sql
DELETE FROM chat_history 
WHERE id = 'chat-session-id' 
AND user_id = 'current-user-id';
```

## Troubleshooting

### "Extension vector does not exist"

**Issue:** pgvector extension not enabled

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

If this fails, contact Supabase support to enable pgvector for your project.

### RAG Returns No Results

**Possible Causes:**
1. `book_knowledge` table is empty
2. `match_threshold` is too high (try lowering to 0.3)
3. Embedding model mismatch
4. Book has no linked knowledge chunks

**Debug Query:**
```sql
SELECT COUNT(*) FROM book_knowledge WHERE book_id = 'your-book-id';
```

### API Key Errors

**Issue:** Missing or invalid API keys

**Check:**
1. `.env.local` file exists with correct keys
2. Environment variables are loaded (`process.env.NEXT_PUBLIC_GEMINI_API_KEY`)
3. Keys are valid (test with direct API call)

### Chat History Not Saving

**Possible Causes:**
1. `ENABLE_CHAT_HISTORY = false` in config
2. User not authenticated
3. Database permissions (RLS policies)

**Solution:**
```typescript
// Check feature flag
import { ENABLE_CHAT_HISTORY } from '@/lib/chat-config'
console.log(ENABLE_CHAT_HISTORY)

// Check user auth
const { data: { user } } = await supabase.auth.getUser()
console.log(user)
```

## Performance Optimization

### Embedding Index

For large `book_knowledge` tables, ensure the vector index exists:

```sql
CREATE INDEX IF NOT EXISTS book_knowledge_embedding_idx 
ON book_knowledge 
USING ivfflat (embedding vector_cosine_ops);
```

### Response Caching

Consider implementing response caching for common questions:

```typescript
// Pseudocode
const cacheKey = `chat:${questionHash}`
const cached = await redis.get(cacheKey)
if (cached) return cached

const response = await gemini.generate(...)
await redis.set(cacheKey, response, { ex: 3600 })
```

## Token Usage Tracking

### Monitoring Costs

Gemini API usage is metered. Track tokens:

```typescript
const response = await model.generateContent(prompt)
const usage = response.usageMetadata

console.log({
  promptTokens: usage.promptTokenCount,
  completionTokens: usage.candidatesTokenCount,
  total: usage.totalTokenCount
})
```

### Cost Optimization Tips

1. **Shorter System Prompts**: Reduce base token usage
2. **Limit RAG Context**: Fewer chunks = fewer tokens
3. **Use Flash Models**: `gemini-1.5-flash` is cheaper than `pro`
4. **Implement Rate Limiting**: Prevent abuse

## Security Considerations

### Row Level Security (RLS)

Ensure RLS policies protect chat history:

```sql
-- Users can only see their own chat history
CREATE POLICY "Users can view own chats"
ON chat_history FOR SELECT
USING (auth.uid() = user_id);

-- Users can only delete their own chats
CREATE POLICY "Users can delete own chats"
ON chat_history FOR DELETE
USING (auth.uid() = user_id);
```

### Input Validation

Always sanitize user input:

```typescript
function validateMessage(message: string) {
  // Max length
  if (message.length > 5000) {
    throw new Error('Message too long')
  }
  
  // Remove potential injection
  return message.trim()
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Example with Vercel Rate Limit
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

const { success } = await ratelimit.limit(userIp)
if (!success) throw new Error('Rate limit exceeded')
```

## Related Files

- `app/api/chat/route.ts` - Chat API endpoint
- `components/chat-interface.tsx` - Chat UI component
- `lib/chat-config.ts` - Feature flags and configuration
- `database/functions/match_book_content.sql` - RAG function
- `docs/database/SCHEMA.md` - Database schema details

## Further Reading

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [HuggingFace Embeddings](https://huggingface.co/docs/transformers/main_classes/model#transformers.TFPreTrainedModel.from_pretrained)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)
