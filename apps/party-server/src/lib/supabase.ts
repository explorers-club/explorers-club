import { Database } from '@explorers-club/database';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export const supabaseAdmin = createClient<Database>(
  environment.supabaseURL,
  environment.supabaseServiceKey
);
