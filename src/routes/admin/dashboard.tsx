import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/features/admin/components/AdminDashboard";
import { adminDashboardOptions } from "@/features/admin/options";

export const Route = createFileRoute("/admin/dashboard")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(adminDashboardOptions.getAdminDashboardData);
	},
	component: AdminDashboard,
});
