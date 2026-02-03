import { createFileRoute } from "@tanstack/react-router";
import RequestsPage from "@/features/requests/components/RequestsPage";

export const Route = createFileRoute("/_protected/requests")({
	component: RequestsPage,
});
