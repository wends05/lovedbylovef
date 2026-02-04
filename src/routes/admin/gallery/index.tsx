import { createFileRoute } from "@tanstack/react-router";
import GalleryManagement from "@/features/admin/gallery/components/gallery-page/GalleryManagement";
import { adminDashboardQueryOptions } from "@/features/admin/options";

export const Route = createFileRoute("/admin/gallery/")({
	component: GalleryManagement,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			adminDashboardQueryOptions.getAllCrochets,
		);
	},
});
