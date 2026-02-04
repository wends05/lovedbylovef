/**
 * Requests Query Options
 */

import {
	infiniteQueryOptions,
	mutationOptions,
	queryOptions,
} from "@tanstack/react-query";
import type { RequestStatus } from "@/generated/prisma/enums";
import {
	cancelRequest,
	deleteImage,
	getRequestById,
	getUserRequests,
	submitRequest,
	updateRequestStatus,
} from "./server";

const REQUESTS_PAGE_SIZE = 10;

export const requestsQueryOptions = {
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

export const requestsMutationOptions = {
	submitRequest: mutationOptions({
		mutationKey: ["requests", "submit"],
		mutationFn: submitRequest,
	}),
	cancelRequest: mutationOptions({
		mutationKey: ["requests", "cancel"],
		mutationFn: cancelRequest,
	}),
	updateRequestStatus: mutationOptions({
		mutationKey: ["requests", "updateStatus"],
		mutationFn: updateRequestStatus,
	}),
	deleteImage: mutationOptions({
		mutationKey: ["requests", "deleteImage"],
		mutationFn: deleteImage,
	}),
};
