import { createFileRoute } from "@tanstack/react-router";
import RequestManagement from "@/features/admin/components/requests-page/RequestManagement";
import { adminDashboardOptions } from "@/features/admin/options";

export const Route = createFileRoute("/admin/requests")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			adminDashboardOptions.getRequests,
		);
	},
	component: RequestManagement,
});
