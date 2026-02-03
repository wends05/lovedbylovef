import { createFileRoute } from "@tanstack/react-router";
import GalleryManagement from "@/features/admin/components/gallery/GalleryManagement";

export const Route = createFileRoute("/admin/gallery")({
	component: GalleryManagement,
});
