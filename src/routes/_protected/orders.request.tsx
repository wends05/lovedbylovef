import { createFileRoute } from "@tanstack/react-router";
import RequestForm from "@/features/requests/components/RequestForm";

export const Route = createFileRoute("/_protected/orders/request")({
	component: OrderRequestPage,
});

function OrderRequestPage() {
	return (
		<div className="max-w-2xl">
			<h1 className="text-3xl font-bold text-foreground mb-6 font-display">
				Request an Order
			</h1>
			<RequestForm />
		</div>
	);
}
