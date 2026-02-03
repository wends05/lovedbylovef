import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/features/public/components/AboutPage";

export const Route = createFileRoute("/_public/about")({
	component: AboutPage,
});
