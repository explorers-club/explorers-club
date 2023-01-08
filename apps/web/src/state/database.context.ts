import { Database } from '@explorers-club/database';
import { createClient } from '@supabase/supabase-js';
import { createContext } from 'react';
import { environment } from '../environments/environment';

export const supabaseClient = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);

export const DatabaseContext = createContext(supabaseClient);
