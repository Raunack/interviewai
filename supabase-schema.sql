-- Run this in your Supabase project → SQL Editor

-- Sessions table: stores each interview attempt
CREATE TABLE IF NOT EXISTS sessions (
  id          BIGSERIAL PRIMARY KEY,
  mode        TEXT NOT NULL CHECK (mode IN ('technical', 'hr', 'case', 'stress')),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  accuracy    INTEGER CHECK (accuracy BETWEEN 0 AND 100),
  clarity     INTEGER CHECK (clarity BETWEEN 0 AND 100),
  depth       INTEGER CHECK (depth BETWEEN 0 AND 100),
  feedback    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick history lookups
CREATE INDEX IF NOT EXISTS idx_sessions_mode ON sessions(mode);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC);

-- View: average scores per mode (useful for dashboard)
CREATE OR REPLACE VIEW session_summary AS
SELECT
  mode,
  COUNT(*) AS total_sessions,
  ROUND(AVG(score), 1) AS avg_score,
  MAX(score) AS best_score,
  ROUND(AVG(accuracy), 0) AS avg_accuracy,
  ROUND(AVG(clarity), 0) AS avg_clarity,
  ROUND(AVG(depth), 0) AS avg_depth
FROM sessions
GROUP BY mode;

-- Enable Row Level Security (RLS) — optional, enable when adding auth
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
