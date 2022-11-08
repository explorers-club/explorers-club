import { supabaseClient } from '../lib/supabase';
import { CustomError, ErrorType } from './errors';

export const fetchUserProfileByName = async (playerName?: string) => {
  if (!playerName) {
    throw new Error('tried to fetch profile without playerName');
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select()
    .eq('player_name', playerName)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new CustomError(ErrorType.NOT_FOUND);
  }
  return data;
};
