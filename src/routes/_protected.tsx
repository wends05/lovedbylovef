import { createFileRoute, Outlet } from "@tanstack/react-router";
import { nonAdminMiddleware } from "@/features/auth/middleware";
import { UserLayout } from "@/features/dashboard/layouts/UserLayout";

export const Route = createFileRoute("/_protected")({
	server: {
		middleware: [nonAdminMiddleware],
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
