import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { requestsMutationOptions } from "@/features/requests/options";
import type { UpdateRequestStatusInput } from "@/features/requests/schemas/UpdateRequestStatus";
import { RequestStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
// Import the route to get typed search params
import { Route } from "@/routes/admin/requests";
import { PendingRequestsFeed } from "./components/feed/PendingRequestsFeed";
import { OtherStatusesView } from "./components/status-sections/OtherStatusesView";

export default function RequestManagement() {
	const queryClient = useQueryClient();
	const updateRequestStatusMutation = useMutation(
		requestsMutationOptions.updateRequestStatus,
	);

	// Use typed search params from the route (validated by Zod schema)
	const search = Route.useSearch();

	// Get initial status from URL, fallback to APPROVED if not set
	const initialStatusTab = search.status ?? RequestStatus.APPROVED;

	const handleProcessRequest = async (data: UpdateRequestStatusInput) => {
		const { success, error } = await tryCatch(
			updateRequestStatusMutation.mutateAsync({ data }),
		);

		if (!success) {
			toast.error("Failed to update request status", {
				description: error || "An error occurred while updating the request",
			});
		} else {
			toast.success(`Request ${data.status.toLowerCase()} successfully`);

			// Invalidate and refetch pending requests
			await queryClient.invalidateQueries({
				queryKey: ["adminRequests"],
			});
		}
	};

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
			<PendingRequestsFeed onProcess={handleProcessRequest} />

			<Separator className="my-8" />

			{/* Other Statuses (Tabs with filters and URL sync) */}
			<OtherStatusesView
				initialStatus={initialStatusTab}
				initialSearch={search.search}
				initialSortBy={search.sortBy}
				initialSortOrder={search.sortOrder}
			/>
		</div>
	);
}
