import { createFileRoute } from "@tanstack/react-router";
import OrderChatPage from "@/features/chat/components/OrderChatPage";

export const Route = createFileRoute("/chat/$orderId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orderId } = Route.useParams();
	return <OrderChatPage orderId={orderId} />;
}
