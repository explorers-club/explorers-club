import { supabaseClient } from '../supabase';

export const createAnonymousUser = async () => {
  const id = crypto.randomUUID();
  const password = crypto.randomUUID();

  const response = await supabaseClient.auth.signUp({
    email: `${id}@anon-users.explorers.club`,
    password,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data.user;
};
