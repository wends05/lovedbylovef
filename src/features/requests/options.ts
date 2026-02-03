/**
 * Requests Query Options
 */

import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { RequestStatus } from "@/generated/prisma/enums";
import { getRequestById, getUserRequests } from "./server";

const REQUESTS_PAGE_SIZE = 10;

export const requestsOptions = {
	getUserRequestsInfinite: (status: RequestStatus | "ALL" = "ALL") =>
		infiniteQueryOptions({
			queryKey: ["userRequests", "infinite", status],
			queryFn: async ({ pageParam }) =>
				getUserRequests({
					data: { status, cursor: pageParam, pageSize: REQUESTS_PAGE_SIZE },
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) =>
				lastPage.hasMore ? lastPage.nextCursor : undefined,
			getPreviousPageParam: () => undefined,
		}),

	getRequestById: (id: string) =>
		queryOptions({
			queryKey: ["request", id],
			queryFn: async () => getRequestById({ data: { id } }),
		}),
};

export { REQUESTS_PAGE_SIZE };
