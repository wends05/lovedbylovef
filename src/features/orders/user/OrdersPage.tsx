import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { OrdersEmptyState } from "@/features/orders/components/OrdersEmptyState";
import { OrdersGrid } from "@/features/orders/components/OrdersGrid";
import { OrdersHeader } from "@/features/orders/components/OrdersHeader";
import { OrdersLayout } from "@/features/orders/components/OrdersLayout";
import { OrdersLoadMore } from "@/features/orders/components/OrdersLoadMore";
import { OrdersSkeleton } from "@/features/orders/components/OrdersSkeleton";
import { ORDERS_PAGE_SIZE } from "@/features/orders/constants";
import { OrderCard } from "./components/OrderCard";
import { userOrdersQueryOptions } from "./options";

export default function OrdersPage() {
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
		}),
	);

	const orders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<OrdersLayout>
			<OrdersHeader
				title="Your Orders"
				subtitle="Upcoming orders currently in progress or completed."
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

			{isLoading ? (
				<OrdersSkeleton />
			) : orders.length === 0 ? (
				<OrdersEmptyState message="No upcoming orders found." />
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
