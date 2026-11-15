import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill it in.');
}

// This is the public (publishable/anon) key; database security depends on Row Level Security policies, which are reviewed in a separate step.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
