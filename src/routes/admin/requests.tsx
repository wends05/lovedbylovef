import { createFileRoute } from "@tanstack/react-router";
import RequestManagement from "@/features/admin/requests-page/components/RequestManagement";
import { RequestSearchParamsSchema } from "@/features/admin/requests-page/schemas/RequestSearchParams";

export const Route = createFileRoute("/admin/requests")({
	validateSearch: RequestSearchParamsSchema,
	component: RequestManagement,
});
