import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function SignOutButton() {
	const router = useRouter();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.invalidate();
		navigate({ to: "/" });
	};
	return (
		<Button variant={"outline"} onClick={handleSignOut}>
			Sign Out
		</Button>
	);
}
