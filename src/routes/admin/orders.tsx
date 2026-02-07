import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { adminDashboardQueryOptions } from "@/features/admin/options";
import OrderManagement from "@/features/orders/admin/components/OrderManagement";
import { GetOrdersQuerySchema } from "@/features/orders/admin/schemas/GetOrdersQuery";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";

export const Route = createFileRoute("/admin/orders")({
	validateSearch: z.object({
		status: GetOrdersQuerySchema.shape.status,
	}),
	loaderDeps: ({ search }) => ({
		status: search.status,
	}),
	component: OrderManagement,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureInfiniteQueryData(
			adminDashboardQueryOptions.getOrders({
				pageSize: ORDERS_PAGE_SIZE,
				status: deps.status,
			}),
		);
	},
});
