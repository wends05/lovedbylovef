import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import { adminMiddleware } from "@/features/auth/middleware";

export const Route = createFileRoute("/admin")({
	server: {
		middleware: [adminMiddleware],
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AdminLayout>
			<Outlet />
		</AdminLayout>
	)
}
