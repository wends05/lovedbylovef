import { useInfiniteQuery } from "@tanstack/react-query";
import { Route } from "@/routes/admin/orders";
import { adminDashboardQueryOptions } from "@/features/admin/options";
import { OrdersEmptyState } from "@/features/orders/components/OrdersEmptyState";
import { OrdersGrid } from "@/features/orders/components/OrdersGrid";
import { OrdersHeader } from "@/features/orders/components/OrdersHeader";
import { OrdersLayout } from "@/features/orders/components/OrdersLayout";
import { OrdersLoadMore } from "@/features/orders/components/OrdersLoadMore";
import { OrdersSkeleton } from "@/features/orders/components/OrdersSkeleton";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";
import type { GetOrdersQueryInput } from "../schemas/GetOrdersQuery";
import { OrderCard } from "./OrderCard";
import { OrderStatusTabs } from "./OrderStatusTabs";

export default function OrderManagement() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const activeStatus: GetOrdersQueryInput["status"] = search.status;

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteQuery(
			adminDashboardQueryOptions.getOrders({
				pageSize: ORDERS_PAGE_SIZE,
				status: activeStatus,
			}),
		);

	const orders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<OrdersLayout>
			<OrdersHeader
				title="Order Management"
				subtitle={`Manage and track all customer orders (${orders.length})`}
			/>
			<OrderStatusTabs
				value={activeStatus}
				onValueChange={(value) =>
					navigate({
						search: (previous) => ({
							...previous,
							status: value,
						}),
					})
				}
			/>

			{isLoading ? (
				<OrdersSkeleton />
			) : orders.length === 0 ? (
				<OrdersEmptyState />
			) : (
				<>
					<OrdersGrid>
						{orders.map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</OrdersGrid>
					<OrdersLoadMore
						hasNextPage={!!hasNextPage}
						isFetching={isFetchingNextPage}
						onLoadMore={fetchNextPage}
					/>
				</>
			)}
		</OrdersLayout>
	);
}
