import { createFileRoute } from "@tanstack/react-router";
import GalleryManagement from "@/features/admin/components/GalleryManagement";

export const Route = createFileRoute("/admin/gallery")({
	component: GalleryManagement,
});
