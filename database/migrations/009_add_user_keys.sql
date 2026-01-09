-- Migration: Add encrypted API key columns to public_users
-- Description: Adds gemini_key_encrypted, groq_key_encrypted, and iv columns to store user API keys securely.

ALTER TABLE public_users
ADD COLUMN IF NOT EXISTS gemini_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS groq_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS iv TEXT;

-- Add comment to explain usage
COMMENT ON COLUMN public_users.gemini_key_encrypted IS 'AES-256 encrypted Gemini API key';
COMMENT ON COLUMN public_users.groq_key_encrypted IS 'AES-256 encrypted Groq API key';
COMMENT ON COLUMN public_users.iv IS 'Initialization vector for decryption';
