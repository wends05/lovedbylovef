import { createFileRoute } from "@tanstack/react-router";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";
import OrdersPage from "@/features/orders/user/OrdersPage";
import { userOrdersQueryOptions } from "@/features/orders/user/options";

export const Route = createFileRoute("/_protected/orders")({
	component: OrdersPage,
	loader: async ({ context }) => {
		await context.queryClient.ensureInfiniteQueryData(
			userOrdersQueryOptions.getUserOrdersInfinite({
				pageSize: ORDERS_PAGE_SIZE,
			}),
		);
	},
});
