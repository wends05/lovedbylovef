import { createFileRoute } from "@tanstack/react-router";
import OrderManagement from "@/features/admin/orders/OrderManagement";

export const Route = createFileRoute("/admin/orders")({
	component: OrderManagement,
});
