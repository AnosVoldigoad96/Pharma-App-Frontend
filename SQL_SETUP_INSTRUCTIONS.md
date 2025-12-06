# SQL Setup Instructions for Chatbot RAG

## Important Notes

⚠️ **DO NOT copy TypeScript/JavaScript code into the SQL editor!**

The error you're seeing happens when you accidentally copy code from `app/api/chat/route.ts` instead of the SQL from `lib/supabase/functions.sql`.

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### 2. Copy the SQL Code

Open the file `lib/supabase/functions.sql` and copy **ONLY** the SQL code below:

```sql
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
```

### 3. Paste and Run

1. Paste the SQL code into the Supabase SQL Editor
2. Click **Run** (or press Ctrl+Enter)
3. You should see "Success. No rows returned"

### 4. Verify the Function

Run this query to verify the function was created:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'match_book_content';
```

You should see `match_book_content` in the results.

## Troubleshooting

### Error: "extension vector does not exist"
- Make sure you ran `CREATE EXTENSION IF NOT EXISTS vector;` first
- If the extension is not available, contact Supabase support to enable pgvector

### Error: "relation book_knowledge does not exist"
- Make sure the `book_knowledge` table exists in your database
- Check that the table has `id`, `book_id`, `content`, and `embedding` columns

### Error: "type vector does not exist"
- The pgvector extension is not enabled
- Run `CREATE EXTENSION IF NOT EXISTS vector;` first

## What NOT to Copy

❌ **DO NOT copy this** (TypeScript code from route.ts):
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// ... etc
```

✅ **DO copy this** (SQL code from functions.sql):
```sql
CREATE OR REPLACE FUNCTION match_book_content(
  -- ... SQL code only
```

