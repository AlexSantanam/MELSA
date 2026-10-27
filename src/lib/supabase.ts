import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://qglxveymlayxzrqjlhop.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_fy8aHZ0uZZXXKww6ylutUQ_NHHfxw5W';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

let client: SupabaseClient;

try {
  client = createClient(supabaseUrl, supabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY);
} catch (err) {
  console.warn('Advertencia al inicializar Supabase, usando cliente de respaldo:', err);
  client = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
}

export const supabase = client;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim().length > 10);
};
