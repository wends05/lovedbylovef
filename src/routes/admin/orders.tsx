import { createFileRoute } from "@tanstack/react-router";
import OrderManagement from "@/features/admin/orders/components/OrderManagement";

export const Route = createFileRoute("/admin/orders")({
	component: OrderManagement,
});
