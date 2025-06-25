// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnsvztqgtukktjrizrpq.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE';  // روح Supabase Dashboard > Settings > API > anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
