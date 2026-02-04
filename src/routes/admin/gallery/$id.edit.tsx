import { createFileRoute } from "@tanstack/react-router";
import EditCrochetForm from "@/features/admin/gallery/edit-crochet/EditCrochetForm";
import { getCrochetById } from "@/features/admin/gallery/server";

export const Route = createFileRoute("/admin/gallery/$id/edit")({
	loader: async ({ context, params }) => {
		const crochet = await context.queryClient.fetchQuery({
			queryKey: ["adminCrochet", params.id],
			queryFn: () => getCrochetById({ data: { id: params.id } }),
		});
		return { crochet };
	},
	component: EditCrochetForm,
});
