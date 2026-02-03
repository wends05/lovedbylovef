import { createFileRoute } from "@tanstack/react-router";
import RequestForm from "@/features/requests/components/RequestForm";

export const Route = createFileRoute("/_protected/order")({
	component: OrderRequestPage,
});

function OrderRequestPage() {
	return (
		<div className="flex h-full items-center justify-center w-full">
			<RequestForm />
		</div>
	);
}
