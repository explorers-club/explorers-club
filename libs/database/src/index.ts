import { Database } from './DatabaseDefinitions';
import type { SupabaseClient } from '@supabase/supabase-js';

export type { Database };
export type ECSupabaseClient = SupabaseClient<Database>;

export type ProfilesTable = Database['public']['Tables']['profiles'];
export type ProfilesRow = PartiesTable['Row'];

export type PartiesTable = Database['public']['Tables']['parties'];
export type PartiesRow = PartiesTable['Row'];

export type PartyPlayersTable = Database['public']['Tables']['party_players'];
export type PartiePlayerwsRow = PartiesTable['Row'];
