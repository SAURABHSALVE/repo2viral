-- Create user_usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT FALSE,
  gumroad_subscription_id TEXT,
  gumroad_license_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_usage
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own usage
CREATE POLICY "Users can view their own usage" 
ON user_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can update their own usage (optional, usually backend only but good for failsafe)
-- We usually restrict UPDATE to service_role, but if your frontend updates it (not recommended), you need this.
-- For now, let's allow SELECT.

-- Policy: Service Role has full access (Implicit in Supabase, but explicit doesn't hurt if we weren't using service role key)
-- Note: backend uses service key, so it bypasses RLS.

-- Verify content_history RLS is also correct
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history" 
ON content_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" 
ON content_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
