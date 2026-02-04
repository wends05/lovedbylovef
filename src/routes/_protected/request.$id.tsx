import { createFileRoute } from "@tanstack/react-router";
import RequestDetailPage from "@/features/requests/components/RequestDetailPage";
import { requestsQueryOptions } from "@/features/requests/options";

export const Route = createFileRoute("/_protected/request/$id")({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			requestsQueryOptions.getRequestById(params.id),
		);
	},
	component: RequestDetailPage,
});
