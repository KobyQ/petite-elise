import { createClient } from '@supabase/supabase-js';
import { supabaseAPIKey, supabaseProjectUrl } from '@/sanity/env';

const supabase = createClient(supabaseProjectUrl, supabaseAPIKey);

export default supabase;
