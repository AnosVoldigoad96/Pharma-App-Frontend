# Chat History Setup Guide

This guide explains how to set up per-user chat history with session management.

## Overview

The chat history system provides:
- **Per-user history**: Each user has their own chat history stored in the database
- **Per-chatbot history**: History is separated by chatbot
- **Session management**: Each page load starts a new session (history resets)
- **Context preservation**: During a session, full conversation history is used as context for AI responses

## Database Setup

### Step 1: Run the SQL Migration

Open your Supabase SQL Editor and run the SQL from `lib/supabase/chat-history.sql`:

```sql
-- Create table for chatbot conversation history
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.public_users(id) ON DELETE CASCADE,
  chatbot_id uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chatbot_conversations_pkey PRIMARY KEY (id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_chatbot_session 
ON public.chatbot_conversations(user_id, chatbot_id, session_id);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session 
ON public.chatbot_conversations(session_id);
```

This will:
- Create a new `chatbot_conversations` table (separate from `chat_messages` which is for social messaging)
- Store chatbot conversation history with `user_id`, `chatbot_id`, `session_id`, `role`, and `content`
- Create indexes for faster queries
- Link to `public_users` and `chatbots` tables with proper foreign keys

## How It Works

### Session Management

1. **New Session**: When a user opens the chatbot page, a new `session_id` is generated
2. **Fresh Start**: No history is loaded from previous sessions (each page load = new session)
3. **Welcome Message**: A welcome message is shown and saved to the database
4. **Message Saving**: All messages (user and assistant) are saved to the database during the session
5. **Context Usage**: Full conversation history from the current session is sent to the API as context

### Message Flow

```
User opens chatbot page
  ↓
New session_id generated
  ↓
Welcome message shown (saved to DB)
  ↓
User sends message
  ↓
User message saved to DB
  ↓
Full conversation history sent to API (as context)
  ↓
AI response received
  ↓
AI response saved to DB
  ↓
Message displayed in UI
```

### Database Structure

The `chatbot_conversations` table stores:
- `id`: Unique message ID
- `user_id`: The user who sent/received the message (references `public_users`)
- `chatbot_id`: The chatbot being used (references `chatbots`)
- `session_id`: The current session (new on each page load)
- `role`: "user" or "assistant"
- `content`: The message text
- `created_at`: Timestamp

**Note**: This table is separate from `chat_messages` which is used for social messaging between users.

## Features

### ✅ Per-User History
- Each user's messages are stored separately
- Users can only see their own chat history

### ✅ Per-Chatbot History
- Messages are linked to specific chatbots
- Different chatbots maintain separate histories

### ✅ Session Reset
- Each page load starts a fresh session
- Previous session history is not loaded
- New `session_id` generated on each page open

### ✅ Context Preservation
- During a session, all messages are used as context
- Full conversation history is sent to the AI API
- AI can reference previous messages in the conversation

### ✅ Database Persistence
- All messages are saved to the database
- History persists across page reloads (but new sessions don't load old history)
- Can be used for analytics or future features

## Usage

### For Logged-In Users
- Messages are automatically saved to the database
- Full conversation history is used as context
- Each page load starts a new session

### For Logged-Out Users
- Messages are shown in the UI but not saved to database
- No history persistence
- Each message is independent (no context from previous messages)

## API Integration

The chat API receives the full conversation history:

```typescript
{
  messages: [
    { role: "assistant", content: "Welcome message..." },
    { role: "user", content: "First question" },
    { role: "assistant", content: "Response..." },
    { role: "user", content: "Follow-up question" }
  ],
  botId: "chatbot-uuid"
}
```

The API uses this history to provide context-aware responses.

## Troubleshooting

### Messages not saving
- Check if user is logged in (only logged-in users have history saved)
- Verify database migration was run successfully
- Check browser console for errors

### History not loading
- This is expected! Each page load starts a new session
- Previous session history is not loaded (by design)
- History is only used during the current session

### Performance issues
- The database indexes should help with query performance
- If you have many messages, consider adding pagination or limits

## Future Enhancements

Possible future features:
- Load previous sessions (if needed)
- Export chat history
- Search through chat history
- Delete old sessions
- Session analytics

