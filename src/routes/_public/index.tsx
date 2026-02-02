import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/features/public/components/Hero";

export const Route = createFileRoute("/_public/")({
	component: HomePage,
});

function HomePage() {
	return <Hero />;
}
