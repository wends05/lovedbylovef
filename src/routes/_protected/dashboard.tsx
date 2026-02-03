import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/features/dashboard/components/HomePage";
import { dashboardOptions } from "@/features/dashboard/options";

export const Route = createFileRoute("/_protected/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			dashboardOptions.getDashboardData,
		);
	},
});

function RouteComponent() {
	return <HomePage />;
}
