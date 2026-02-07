import { createFileRoute } from "@tanstack/react-router";
import GalleryPage from "@/features/public/components/crochets/CrochetGallery";
import { publicQueryOptions } from "@/features/public/options";

export const Route = createFileRoute("/_public/gallery")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				publicQueryOptions.getVisibleCrochets(),
			),
			context.queryClient.ensureQueryData(publicQueryOptions.getCategories()),
		]);
	},
	component: GalleryPage,
});
