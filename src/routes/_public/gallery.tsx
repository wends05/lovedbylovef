import { createFileRoute } from "@tanstack/react-router";
import GalleryPage from "@/features/public/components/crochets/CrochetGallery";
import { publicOptions } from "@/features/public/options";

export const Route = createFileRoute("/_public/gallery")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(publicOptions.getVisibleCrochets()),
			context.queryClient.ensureQueryData(publicOptions.getCategories()),
		]);
	},
	component: GalleryPage,
});
