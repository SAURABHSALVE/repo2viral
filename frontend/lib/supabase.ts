// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// export const supabase = createClient(supabaseUrl, supabaseKey)



import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// FAIL-SAFE: If keys are missing (like during a build), use dummy values so it doesn't crash.
// The app won't work without keys, but it will at least finish building.
// NOTE: We must ensure the dummy URL is a valid URL format 'https://...' to pass library validation.
const url = supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co';

const key = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(url, key);