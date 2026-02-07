import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getOrderById, updateOrderLifecycle } from "./server";

export const ordersMutationOptions = {
	updateOrderLifecycle: mutationOptions({
		mutationKey: ["orders", "updateLifecycle"],
		mutationFn: updateOrderLifecycle,
	}),
};

export const ordersQueryOptions = {
	getOrderById: (id: string) =>
		queryOptions({
			queryKey: ["order", id],
			queryFn: async () => getOrderById({ data: { id } }),
		}),
};
