import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { GetRequestsQueryInput } from "../requests/schemas/GetRequestsQuery";
import { getAllRequests } from "../requests/server";
import { getAdminDashboardData } from "./dashboard/server";
import { getAllCrochetsAdmin, getCrochetById } from "./gallery/server";

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
