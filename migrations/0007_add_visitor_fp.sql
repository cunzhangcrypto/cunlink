-- Add visitor_fp column used by click recording (fingerprint dedup).
-- This column exists in 0000_full_schema.sql but was never added via the
-- numbered migration chain (0001-0006), so existing databases are missing it.
ALTER TABLE clicks ADD COLUMN visitor_fp TEXT;

CREATE INDEX IF NOT EXISTS idx_clicks_visitor_fp ON clicks(visitor_fp);
