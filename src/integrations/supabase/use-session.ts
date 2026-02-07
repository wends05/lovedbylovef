import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./client";

type UseSupabaseSessionResult = {
	session: Session | null;
	isLoading: boolean;
};

export function useSupabaseSession(): UseSupabaseSessionResult {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const loadSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (isMounted) {
				setSession(data.session ?? null);
				setIsLoading(false);
			}
		};

		loadSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, nextSession) => {
				setSession(nextSession);
				setIsLoading(false);
			},
		);

		return () => {
			isMounted = false;
			listener.subscription.unsubscribe();
		};
	}, []);

	return { session, isLoading };
}
