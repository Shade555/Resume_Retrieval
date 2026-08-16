-- ==========================================
-- Phase 6: Database Optimization
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- 1. Optimize Vector Search (HNSW Index)
-- The Hierarchical Navigable Small World (HNSW) index significantly speeds up 
-- vector similarity search on large datasets compared to exact nearest neighbor.
-- We use inner product (halfvec_ip_ops) as it is recommended for normalized embeddings 
-- like those from Xenova/all-MiniLM-L6-v2 (which we use).
CREATE INDEX ON resumes USING hnsw (embedding vector_ip_ops);

-- Note: Ensure your embeddings are normalized (Transformers.js normalizes by default 
-- with `normalize: true`). If using cosine distance, you can use `vector_cosine_ops`.
-- We will use `vector_cosine_ops` to be completely safe and match our existing `<=>` operator.
DROP INDEX IF EXISTS resumes_embedding_idx;
CREATE INDEX resumes_embedding_idx ON resumes USING hnsw (embedding vector_cosine_ops);

-- 2. Optimize Array Filtering (GIN Index)
-- Speeds up filtering by skills (e.g., `skills @> '{"React"}'`)
CREATE INDEX resumes_skills_idx ON resumes USING gin (skills);

-- 3. Optimize Text Search (GIN Index on raw_text)
-- Optional: If you plan to do standard keyword search alongside vector search
CREATE INDEX resumes_raw_text_idx ON resumes USING gin (to_tsvector('english', raw_text));

-- ==========================================
-- Recreate the RPC function to ensure it uses the index effectively
-- (HNSW uses the `<=>` operator for cosine distance)
-- ==========================================
CREATE OR REPLACE FUNCTION match_resumes (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  candidate_name text,
  email text,
  skills text[],
  raw_text text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    resumes.id,
    resumes.candidate_name,
    resumes.email,
    resumes.skills,
    resumes.raw_text,
    1 - (resumes.embedding <=> query_embedding) AS similarity
  FROM resumes
  WHERE 1 - (resumes.embedding <=> query_embedding) > match_threshold
  ORDER BY resumes.embedding <=> query_embedding
  LIMIT match_count;
$$;
