import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azvuadhnieulelinfveb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dnVhZGhuaWV1bGVsaW5mdmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjEwNTI3NjEsImV4cCI6MTk3NjYyODc2MX0.Dmt6k6ZvWZP9jgbk5Dt2Q4U-ekrq-gNQPwqaYdX-8fQ';
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
