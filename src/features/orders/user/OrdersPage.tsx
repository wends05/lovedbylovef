import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { OrdersEmptyState } from "@/features/orders/components/OrdersEmptyState";
import { OrdersGrid } from "@/features/orders/components/OrdersGrid";
import { OrdersHeader } from "@/features/orders/components/OrdersHeader";
import { OrdersLayout } from "@/features/orders/components/OrdersLayout";
import { OrdersLoadMore } from "@/features/orders/components/OrdersLoadMore";
import { OrdersSkeleton } from "@/features/orders/components/OrdersSkeleton";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";
import { Route } from "@/routes/_protected/orders";
import { OrderCard } from "./components/OrderCard";
import { OrderStatusTabs } from "./components/OrderStatusTabs";
import { userOrdersQueryOptions } from "./options";

export default function OrdersPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const activeStatus = search.status;

	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useInfiniteQuery(
		userOrdersQueryOptions.getUserOrdersInfinite({
			pageSize: ORDERS_PAGE_SIZE,
			status: activeStatus,
		}),
	);

	const orders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<OrdersLayout>
			<OrdersHeader
				title="Your Orders"
				subtitle={`Track and manage your order lifecycle (${orders.length})`}
				actions={
					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						Refresh
					</Button>
				}
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
				<OrdersEmptyState message="No orders found for this status." />
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
