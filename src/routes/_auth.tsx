import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUserRole } from "@/features/auth/server";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_auth")({
	loader: async () => {
		const { data } = await supabase.auth.getSession();

		if (data.session) {
			const roleData = await getCurrentUserRole();
			if (roleData.role === "ADMIN") {
				throw redirect({ to: "/admin/dashboard" });
			} else {
				throw redirect({ to: "/dashboard" });
			}
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
