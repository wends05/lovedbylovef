import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/features/public/components/Header";

export const Route = createFileRoute("/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
