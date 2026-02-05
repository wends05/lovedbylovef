import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { nonAdminMiddleware } from "@/features/auth/middleware";
import { UserLayout } from "@/features/dashboard/UserLayout";
import { getCurrentUserRole } from "@/features/auth/server";

export const Route = createFileRoute("/_protected")({
	server: {
		middleware: [nonAdminMiddleware],
	},
	// extra validation
	loader: async () => {
		const roleData = await getCurrentUserRole();
		if (roleData.role === "ADMIN") {
			throw redirect({ to: "/admin/dashboard" });
		}
	},
	component: ProtectedLayout,
});

function ProtectedLayout() {
	return (
		<UserLayout>
			<Outlet />
		</UserLayout>
	);
}
