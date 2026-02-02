import { createFileRoute } from "@tanstack/react-router";
import RequestManagement from "@/features/admin/components/RequestManagement";

export const Route = createFileRoute("/admin/requests")({
	component: RequestManagement,
});
