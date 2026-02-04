import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { adminDashboardOptions } from "@/features/admin/options";
import type { RequestStatus } from "@/generated/prisma/enums";

// Type for non-pending statuses
type NonPendingStatus = Exclude<RequestStatus, "PENDING">;

interface UseStatusRequestsOptions {
	status: NonPendingStatus;
	pageSize?: number;
	sortBy?: "createdAt" | "updatedAt" | "userName";
	sortOrder?: "asc" | "desc";
	search?: string;
	dateFrom?: string;
	dateTo?: string;
}

export function useStatusRequests(options: UseStatusRequestsOptions) {
	const filters = useMemo(
		() => ({
			status: options.status,
			pageSize: options.pageSize ?? 20,
			sortBy: options.sortBy ?? "createdAt",
			sortOrder: options.sortOrder ?? "desc",
			search: options.search,
			dateFrom: options.dateFrom,
			dateTo: options.dateTo,
		}),
		[options],
	);

	return useInfiniteQuery(adminDashboardOptions.getRequests(filters));
}
