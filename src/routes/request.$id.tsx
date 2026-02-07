import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { authMiddleware } from "@/features/auth/middleware";
import RequestDetailPage from "@/features/requests/components/request-detail/RequestDetailPage";
import { requestsQueryOptions } from "@/features/requests/options";

export const Route = createFileRoute("/request/$id")({
	validateSearch: z.object({
		edit: z.boolean().optional(),
	}),
	server: {
		middleware: [authMiddleware],
	},
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			requestsQueryOptions.getRequestById(params.id),
		);
	},
	component: RequestDetailPage,
});
