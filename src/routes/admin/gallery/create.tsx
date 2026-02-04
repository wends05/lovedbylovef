import { createFileRoute } from "@tanstack/react-router";
import CreateCrochetForm from "@/features/admin/gallery/create-crochet/CreateCrochetForm";

export const Route = createFileRoute("/admin/gallery/create")({
	component: CreateCrochetForm,
});
