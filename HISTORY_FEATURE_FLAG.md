# Chat History Feature Flag

## Current Status: DISABLED

Chat history is currently **disabled** to save tokens and costs (optimized for free tier usage).

## How to Re-Enable in the Future

When you're ready to enable chat history again:

### Step 1: Update the Feature Flag

Edit `lib/supabase/chat-config.ts`:

```typescript
// Change this line:
export const ENABLE_CHAT_HISTORY = false;

// To:
export const ENABLE_CHAT_HISTORY = true;
```

### Step 2: Run Database Migration (If Not Already Done)

If you haven't already created the `chatbot_conversations` table, run the SQL from:
- `lib/supabase/chat-history.sql`

### Step 3: Test

1. Log in as a user
2. Open a chatbot
3. Send messages
4. Check the database to verify messages are being saved
5. Reload the page - history should be available (if you implement loading previous sessions)

## What's Disabled

When `ENABLE_CHAT_HISTORY = false`:
- ❌ Messages are NOT saved to database
- ❌ Only current message is sent to API (no conversation context)
- ❌ No history loading from previous sessions
- ✅ Minimal token usage (single message per request)
- ✅ Lower API costs

## What's Enabled

When `ENABLE_CHAT_HISTORY = true`:
- ✅ Messages are saved to `chatbot_conversations` table
- ✅ Conversation history is sent to API (limited to last 10 messages)
- ✅ Better context for AI responses
- ⚠️ Higher token usage (~50-60% more per request)

## Configuration Options

When re-enabling, you can also adjust:

```typescript
// In lib/supabase/chat-config.ts

// Number of messages to include in context
export const MAX_CONTEXT_MESSAGES = 10; // Adjust as needed

// Maximum characters in context
export const MAX_CONTEXT_CHARS = 8000; // Adjust as needed
```

See `TOKEN_USAGE_GUIDE.md` for more details on token management.

## Files Involved

- `lib/supabase/chat-config.ts` - Feature flag and configuration
- `app/books/[id]/chat/page.tsx` - Chat UI (uses the flag)
- `lib/supabase/chat-history.ts` - History functions (ready to use)
- `lib/supabase/chat-history.sql` - Database schema (ready to use)

All code is preserved and ready to be re-enabled with a single flag change!

