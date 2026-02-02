import { createFileRoute } from "@tanstack/react-router";
import OrdersPage from "@/features/dashboard/components/OrdersPage";

export const Route = createFileRoute("/_protected/orders")({
	component: OrdersPage,
});
