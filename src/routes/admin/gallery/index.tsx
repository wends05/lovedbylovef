import { createFileRoute } from "@tanstack/react-router";
import GalleryManagement from "@/features/admin/gallery/components/gallery-page/GalleryManagement";

export const Route = createFileRoute("/admin/gallery/")({
	component: GalleryManagement,
});
