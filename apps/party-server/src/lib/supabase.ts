import { createClient } from '@supabase/supabase-js';
import { RealtimeClient } from '@supabase/realtime-js';

if (!process.env['SUPABASE_URL']) {
  throw new Error('SUPABASE_URL not configured');
}
if (!process.env['SUPABASE_KEY']) {
  throw new Error('SUPABASE_KEY not configured');
}

const REALTIME_URL = `${process.env['SUPABASE_URL']}:4000/socket`;

export const socket = new RealtimeClient(REALTIME_URL);

export const supabaseAdmin = createClient(
  process.env['SUPABASE_URL'],
  process.env['SUPABASE_KEY']
);
