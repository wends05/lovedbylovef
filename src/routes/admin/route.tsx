import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { adminMiddleware } from "@/features/auth/middleware";
import { getCurrentUserRole } from "@/features/auth/server";

export const Route = createFileRoute("/admin")({
	server: {
		middleware: [adminMiddleware],
	},
	loader: async () => {
		const roleData = await getCurrentUserRole();
		if (roleData.role === "USER") {
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
