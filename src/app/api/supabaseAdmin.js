// server-side only: uses Service Role Key safely
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase env variables!');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
