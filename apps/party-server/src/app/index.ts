import { socket, supabaseAdmin } from '../lib/supabase';

export const runApp = () => {
  console.log('hi');
  socket.connect();
};
