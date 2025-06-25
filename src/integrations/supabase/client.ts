// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnsvztqgtukktjrizrpq.supabase.co';  // رابط API الخاص بمشروعك
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3Z6dHFndHVra3Rqcml6cnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTI0OTAsImV4cCI6MjA2NjI2ODQ5MH0.VMmbk0hSENA6fl8d1m5NlV2moDTr8bDe_XPQhj0-dAs';           // المفتاح العام (anon key) من لوحة Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
