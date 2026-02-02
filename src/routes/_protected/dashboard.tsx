import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/features/dashboard/components/HomePage";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = authClient.useSession();

	console.log(session);
	return <HomePage />;
}
