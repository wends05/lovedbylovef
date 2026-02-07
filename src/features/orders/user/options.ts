import { infiniteQueryOptions } from "@tanstack/react-query";
import type { GetUserOrdersInput } from "./schemas/GetUserOrders";
import { getUserOrders } from "./server";

interface UserOrdersInfiniteParams {
	pageSize?: number;
	status?: GetUserOrdersInput["status"];
}

export const userOrdersQueryOptions = {
	getUserOrdersInfinite: ({
		pageSize = 20,
		status = "ALL",
	}: UserOrdersInfiniteParams = {}) =>
		infiniteQueryOptions({
			queryKey: ["userOrders", "infinite", pageSize, status],
			queryFn: ({ pageParam }) =>
				getUserOrders({
					data: {
						cursor: pageParam as string | undefined,
						pageSize,
						status,
					},
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),
};
