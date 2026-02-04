import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { adminDashboardQueryOptions } from "@/features/admin/options";
import type { RequestStatus } from "@/generated/prisma/enums";

interface UseStatusRequestsOptions {
	status: RequestStatus;
	pageSize?: number;
	sortBy?: "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
	search?: string;
}

export function useStatusRequests(options: UseStatusRequestsOptions) {
	const filters = useMemo(
		() => ({
			status: options.status,
			pageSize: options.pageSize ?? 20,
			sortBy: options.sortBy ?? "createdAt",
			sortOrder: options.sortOrder ?? "desc",
			search: options.search,
		}),
		[options],
	);

	return useInfiniteQuery(adminDashboardQueryOptions.getRequests(filters));
}
