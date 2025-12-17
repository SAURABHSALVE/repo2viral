-- Create content_history table
CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  generated_content JSONB NOT NULL, -- Storing the entire JSON result
  platform TEXT, -- e.g., 'All', or specific if we split them later
  created_at TIMESTAMPTZ DEFAULT now(),
  tone_used TEXT
);

-- Enable Row Level Security
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Create Policy for selecting own history
CREATE POLICY "Users can view their own history" 
ON content_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create Policy for inserting own history
CREATE POLICY "Users can insert their own history" 
ON content_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
