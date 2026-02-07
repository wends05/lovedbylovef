import { createFileRoute } from "@tanstack/react-router";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";
import OrdersPage from "@/features/orders/user/OrdersPage";
import { userOrdersQueryOptions } from "@/features/orders/user/options";
import { GetUserOrdersSchema } from "@/features/orders/user/schemas/GetUserOrders";

export const Route = createFileRoute("/_protected/orders")({
	validateSearch: GetUserOrdersSchema.pick({
		status: true,
	}),
	loaderDeps: ({ search }) => ({
		status: search.status,
	}),
	component: OrdersPage,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureInfiniteQueryData(
			userOrdersQueryOptions.getUserOrdersInfinite({
				pageSize: ORDERS_PAGE_SIZE,
				status: deps.status,
			}),
		);
	},
});
