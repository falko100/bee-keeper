import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phqqlxvytxfyseyariwf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8OLzjYL5wxIL-TaDVoLtTw_xjoQSIYk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
