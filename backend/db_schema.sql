-- Run this SQL in your Supabase SQL Editor to update the database schema for Gumroad integration
-- This adds columns to store subscription details

ALTER TABLE user_usage
ADD COLUMN IF NOT EXISTS gumroad_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS gumroad_license_key TEXT;

-- Verify is_pro column exists (it should, but just in case)
-- ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Optional: Create an index for faster lookups by email if table grows large
CREATE INDEX IF NOT EXISTS idx_user_usage_email ON user_usage(email);
