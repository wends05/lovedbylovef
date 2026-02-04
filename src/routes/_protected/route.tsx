import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { nonAdminMiddleware } from "@/features/auth/middleware";
import { UserLayout } from "@/features/dashboard/UserLayout";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected")({
	server: {
		middleware: [nonAdminMiddleware],
	},
	// extra validation
	loader: async () => {
		const session = await authClient.getSession();
		if (session.data?.user.role === "ADMIN") {
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
