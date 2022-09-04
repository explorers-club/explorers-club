import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export const supabaseAdmin = createClient(
  environment.supabaseURL,
  environment.supabseServiceKey
);
