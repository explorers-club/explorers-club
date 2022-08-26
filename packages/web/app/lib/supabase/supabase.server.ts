import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL not configured');
}
if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY not configured');
}

// @ts-ignore
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
