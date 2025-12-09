-- ============================================
-- SQL Function for Vector Similarity Search
-- ============================================
-- IMPORTANT: Copy ONLY the SQL code below (starting from line 10)
-- DO NOT copy any TypeScript/JavaScript code
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Enable pgvector extension (run this first if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Drop existing function if it exists (to avoid return type conflicts)
DROP FUNCTION IF EXISTS match_book_content(vector, uuid, double precision, integer);

-- Step 3: Create the match_book_content function
CREATE OR REPLACE FUNCTION match_book_content(
  query_embedding vector(768),
  target_book_id uuid,
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bk.id,
    bk.content,
    1 - (bk.embedding <=> query_embedding) AS similarity
  FROM book_knowledge bk
  WHERE bk.book_id = target_book_id
    AND 1 - (bk.embedding <=> query_embedding) > match_threshold
  ORDER BY bk.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
