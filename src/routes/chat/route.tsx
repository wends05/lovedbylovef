import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-10 h-screen flex-1">
			<Outlet />
		</div>
	);
}
