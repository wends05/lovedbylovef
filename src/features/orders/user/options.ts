import { infiniteQueryOptions } from "@tanstack/react-query";
import { getUserOrders } from "./server";

interface UserOrdersInfiniteParams {
	pageSize?: number;
}

export const userOrdersQueryOptions = {
	getUserOrdersInfinite: ({ pageSize = 20 }: UserOrdersInfiniteParams = {}) =>
		infiniteQueryOptions({
			queryKey: ["userOrders", "infinite", pageSize],
			queryFn: ({ pageParam }) =>
				getUserOrders({
					data: {
						cursor: pageParam as string | undefined,
						pageSize,
					},
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),
};
