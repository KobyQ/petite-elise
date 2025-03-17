import { createClient } from "@supabase/supabase-js";
import { supabaseAPIKey, supabaseProjectUrl, supabaseServiceRoleKey } from "@/sanity/env";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Regular Supabase client (Frontend-safe)
export const supabase = createClient(supabaseProjectUrl, supabaseAPIKey);

// Admin Supabase client (Server-side only)
export const supabaseAdmin = createClient(supabaseProjectUrl, supabaseServiceRoleKey);

export const supabaseAuth = createClientComponentClient();

export default supabase;
