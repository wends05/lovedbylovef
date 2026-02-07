import { createFileRoute } from "@tanstack/react-router";
import OrderChatPage from "@/features/chat/components/OrderChatPage";
import { chatQueryOptions } from "@/features/chat/options";

export const Route = createFileRoute("/chat/$orderId")({
	component: RouteComponent,
	loader: async ({ context, params: { orderId } }) => {
		await context.queryClient.ensureQueryData(
			chatQueryOptions.getChatData(orderId),
		);
	},
});

function RouteComponent() {
	const { orderId } = Route.useParams();
	return <OrderChatPage orderId={orderId} />;
}
