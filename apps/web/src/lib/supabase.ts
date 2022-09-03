import { createClient } from '@supabase/supabase-js';
import type { Database } from '@explorers-club/database';
import { environment } from '../environments/environment';

export const supabaseClient = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);
