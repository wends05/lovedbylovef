import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/features/admin/dashboard/components/AdminDashboard";
import { adminDashboardQueryOptions } from "@/features/admin/options";

export const Route = createFileRoute("/admin/dashboard")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			adminDashboardQueryOptions.getAdminDashboardData,
		);
	},
	component: AdminDashboard,
});
