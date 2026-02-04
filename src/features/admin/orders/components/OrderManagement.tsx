import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { OrderStatus } from "@/generated/prisma/browser";
import { adminDashboardQueryOptions } from "../../options";
import { OrderGrid } from "./OrderGrid";
import { OrderHeader } from "./OrderHeader";
import { OrderLoadMore } from "./OrderLoadMore";
import { OrderStatusTabs } from "./OrderStatusTabs";
import { OrdersEmptyState } from "./OrdersEmptyState";
import { OrdersSkeleton } from "./OrdersSkeleton";

export default function OrderManagement() {
	const [activeStatus, setActiveStatus] = useState<
		keyof typeof OrderStatus | "ALL"
	>("ALL");
	const pageSize = 20;
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteQuery(
			adminDashboardQueryOptions.getOrders({
				pageSize,
				status: activeStatus,
			}),
		);

	const orders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<div className="space-y-6">
			<OrderHeader totalCount={orders.length} />
			<OrderStatusTabs
				value={activeStatus}
				onValueChange={(value) => setActiveStatus(value)}
			/>

			{isLoading ? (
				<OrdersSkeleton />
			) : orders.length === 0 ? (
				<OrdersEmptyState />
			) : (
				<>
					<OrderGrid orders={orders} />
					<OrderLoadMore
						hasNextPage={!!hasNextPage}
						isFetching={isFetchingNextPage}
						onLoadMore={fetchNextPage}
					/>
				</>
			)}
		</div>
	);
}
