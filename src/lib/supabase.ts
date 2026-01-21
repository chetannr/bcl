import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Initializing Supabase client...');
console.log('[Supabase] URL configured:', !!supabaseUrl);
console.log('[Supabase] Anon key configured:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] ERROR: Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
console.log('[Supabase] Supabase client created successfully');
