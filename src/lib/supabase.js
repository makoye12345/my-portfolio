import { createClient } from "@supabase/supabase-js";

// Read configuration from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check configuration
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration.");
}

// Create Supabase client
export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);