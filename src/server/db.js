/**
 * Supabase admin client (service role — server only).
 * `supabase` is null when the database env vars are missing; every caller
 * must handle that (requireDb sends a 503, lead routes fall back to JSONL).
 */
import { createClient } from '@supabase/supabase-js';

export const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;
