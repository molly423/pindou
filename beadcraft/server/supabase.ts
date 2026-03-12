import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

