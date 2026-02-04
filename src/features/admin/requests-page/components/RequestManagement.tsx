import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import type { UpdateRequestStatusInput } from "@/features/requests/schemas/UpdateRequestStatus";
import { updateRequestStatus } from "@/features/requests/server";
import { RequestStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
// Import the route to get typed search params
import { Route } from "@/routes/admin/requests";
import { adminDashboardOptions } from "../../options";
import { PendingRequestsFeed } from "./feed/PendingRequestsFeed";
import { OtherStatusesView } from "./status-sections/OtherStatusesView";

// Default filters for pending requests
const PENDING_FILTERS = {
	status: "PENDING" as const,
	pageSize: 10,
	sortBy: "createdAt" as const,
	sortOrder: "desc" as const,
};

export default function RequestManagement() {
	const queryClient = useQueryClient();

	// Use typed search params from the route (validated by Zod schema)
	const search = Route.useSearch();

	// Get initial status from URL, fallback to APPROVED if not set
	// Note: This component only handles non-pending statuses
	const initialStatusTab = (search.status ?? RequestStatus.APPROVED) as Exclude<
		RequestStatus,
		"PENDING"
	>;

	// Pending requests query (always PENDING, no URL sync)
	const pendingQuery = useInfiniteQuery(
		adminDashboardOptions.getRequests(PENDING_FILTERS),
	);

	const handleProcessRequest = useCallback(
		async (data: UpdateRequestStatusInput) => {
			// handle updates to the request status.
			const { success, error } = await tryCatch(updateRequestStatus({ data }));

			if (!success) {
				toast.error("Failed to update request status", {
					description: error || "An error occurred while updating the request",
				});
			} else {
				toast.success(`Request ${data.status.toLowerCase()} successfully`);

				// Invalidate and refetch pending requests
				await queryClient.invalidateQueries({
					queryKey: ["adminRequests", PENDING_FILTERS],
				});
			}
		},
		[queryClient],
	);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Request Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Review and manage custom order requests from users
				</p>
			</div>

			{/* Pending Requests Feed */}
			<PendingRequestsFeed
				query={pendingQuery}
				onProcess={handleProcessRequest}
			/>

			<Separator className="my-8" />

			{/* Other Statuses (Tabs with filters and URL sync) */}
			<OtherStatusesView
				initialStatus={initialStatusTab}
				initialSearch={search.search}
				initialSortBy={search.sortBy}
				initialSortOrder={search.sortOrder}
				initialDateFrom={search.dateFrom}
				initialDateTo={search.dateTo}
			/>
		</div>
	);
}
