-- Fix missing columns in content_history
ALTER TABLE content_history ADD COLUMN IF NOT EXISTS generated_content JSONB;
ALTER TABLE content_history ADD COLUMN IF NOT EXISTS tone_used TEXT;
ALTER TABLE content_history ADD COLUMN IF NOT EXISTS platform TEXT;

-- Reload Schema Cache (Supabase specific)
NOTIFY pgrst, 'reload config';
