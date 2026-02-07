import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { GetRequestsQueryInput } from "../requests/schemas/GetRequestsQuery";
import type { GetOrdersQueryInput } from "@/features/orders/admin/schemas/GetOrdersQuery";
import { getAllRequests } from "../requests/server";
import { getAdminDashboardData } from "./dashboard/server";
import { getAllCrochetsAdmin, getCrochetById } from "./gallery/server";
import { getAllOrders } from "@/features/orders/admin/server";

export const adminDashboardQueryOptions = {
	getAdminDashboardData: queryOptions({
		queryKey: ["adminDashboardData"],
		queryFn: getAdminDashboardData,
	}),

	getRequests: (filters: Omit<GetRequestsQueryInput, "cursor">) =>
		infiniteQueryOptions({
			queryKey: ["adminRequests", filters],
			queryFn: ({ pageParam }) =>
				getAllRequests({
					data: {
						...filters,
						cursor: pageParam as string | undefined,
					},
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),

getOrders: (
		filters: { pageSize?: number; status?: GetOrdersQueryInput["status"] } = {},
	) =>
		infiniteQueryOptions({
			queryKey: ["adminOrders", filters],
			queryFn: ({ pageParam }) =>
				getAllOrders({
					data: {
						pageSize: filters.pageSize ?? 20,
						status: filters.status ?? "ALL",
						cursor: pageParam as string | undefined,
					},
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),

	// Gallery queries
	getAllCrochets: queryOptions({
		queryKey: ["adminCrochets"],
		queryFn: getAllCrochetsAdmin,
	}),

	getCrochetById: (id: string) =>
		queryOptions({
			queryKey: ["adminCrochet", id],
			queryFn: () => getCrochetById({ data: { id } }),
		}),
};
