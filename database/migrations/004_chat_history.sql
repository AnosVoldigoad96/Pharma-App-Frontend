-- SQL Migration: Create chatbot_conversations table for chatbot history
-- Run this in your Supabase SQL Editor
-- This is separate from the chat_messages table which is for social messaging

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

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user 
ON public.chatbot_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_chatbot 
ON public.chatbot_conversations(chatbot_id);

-- Add comment to table
COMMENT ON TABLE public.chatbot_conversations IS 'Stores chatbot conversation history, separate from social chat_messages table';
