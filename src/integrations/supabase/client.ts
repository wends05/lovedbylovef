import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Supabase environment variables are not set");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
