import { createFileRoute } from "@tanstack/react-router";
import { adminDashboardQueryOptions } from "@/features/admin/options";
import OrderManagement from "@/features/orders/admin/components/OrderManagement";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";

export const Route = createFileRoute("/admin/orders")({
	component: OrderManagement,
	loader: async ({ context }) => {
		await context.queryClient.ensureInfiniteQueryData(
			adminDashboardQueryOptions.getOrders({
				pageSize: ORDERS_PAGE_SIZE,
				status: "ALL",
			}),
		);
	},
});
