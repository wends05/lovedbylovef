import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/features/dashboard/home/components/HomePage";
import { dashboardQueryOptions } from "@/features/dashboard/options";

export const Route = createFileRoute("/_protected/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			dashboardQueryOptions.getDashboardData,
		);
	},
});

function RouteComponent() {
	return <HomePage />;
}
