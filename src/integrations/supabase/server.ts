import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

export function getSupabaseServerClient() {
	const supabase_url = process.env.VITE_SUPABASE_URL;
	const supabase_key = process.env.VITE_SUPABASE_KEY;

	if (!supabase_url || !supabase_key) {
		throw new Error("Supabase environment variables are not set");
	}

	return createServerClient(supabase_url, supabase_key, {
		cookies: {
			getAll() {
				return Object.entries(getCookies()).map(([name, value]) => ({
					name,
					value,
				}));
			},
			setAll(cookies) {
				cookies.forEach((cookie) => {
					setCookie(cookie.name, cookie.value, cookie.options);
				});
			},
		},
	});
}
