import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
	loader: async () => {
		const { data: session } = await authClient.getSession();

		if (session) {
			const userRole = session.user.role;
			if (userRole === "ADMIN") {
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
