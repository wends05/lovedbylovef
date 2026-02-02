import { createFileRoute, Outlet } from "@tanstack/react-router";
import { userMiddleware } from "@/features/auth/middleware";
import { UserLayout } from "@/features/dashboard/layouts/UserLayout";

export const Route = createFileRoute("/_protected")({
	server: {
		middleware: [userMiddleware],
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
