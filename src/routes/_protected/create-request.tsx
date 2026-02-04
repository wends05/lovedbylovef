import { createFileRoute } from "@tanstack/react-router";
import CreateRequestForm from "@/features/dashboard/requests/components/CreateRequestForm";

export const Route = createFileRoute("/_protected/create-request")({
	component: OrderRequestPage,
});

function OrderRequestPage() {
	return (
		<div className="flex h-full items-center justify-center w-full">
			<CreateRequestForm />
		</div>
	)
}
