import type { Request } from 'express';
import { createClient } from '@supabase/supabase-js';

export type AuthedRequest = Request & { userId: string };

export async function requireUser(req: Request): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url) throw new Error('Missing SUPABASE_URL');
  if (!anonKey) throw new Error('Missing SUPABASE_ANON_KEY');

  const authHeader = req.header('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];
  if (!token) {
    const err = new Error('Missing Authorization Bearer token');
    (err as any).status = 401;
    throw err;
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    const err = new Error('Invalid or expired token');
    (err as any).status = 401;
    throw err;
  }
  return data.user.id;
}

