import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { adminMiddleware } from "@/features/auth/middleware";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin")({
	server: {
		middleware: [adminMiddleware],
	},
	loader: async () => {
		const session = await authClient.getSession();
		if (session.data?.user.role === "USER") {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AdminLayout>
			<Outlet />
		</AdminLayout>
	);
}
