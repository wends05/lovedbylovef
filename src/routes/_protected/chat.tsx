import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "@/features/dashboard/chat/components/ChatPage";

export const Route = createFileRoute("/_protected/chat")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ChatPage />;
}
