import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import RequestDetailPage from "@/features/requests/components/RequestDetailPage";
import { requestsQueryOptions } from "@/features/requests/options";

export const Route = createFileRoute("/_protected/request/$id")({
	validateSearch: z.object({
		edit: z.boolean().optional(),
	}),
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			requestsQueryOptions.getRequestById(params.id),
		);
	},
	component: RequestDetailPage,
});
