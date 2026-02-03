import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/features/public/components/ContactPage";

export const Route = createFileRoute("/_public/contact")({
	component: ContactPage,
});
