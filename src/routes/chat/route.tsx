import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-dvh min-h-0 p-3 sm:p-6 lg:p-10">
			<Outlet />
		</div>
	);
}
