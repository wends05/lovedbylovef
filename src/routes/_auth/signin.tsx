import { createFileRoute } from "@tanstack/react-router";
import SignIn from "@/features/auth/components/SignIn";

export const Route = createFileRoute("/_auth/signin")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignIn />;
}
