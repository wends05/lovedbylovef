import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RequestStatus } from "@/generated/prisma/enums";
import type { AdminRequestsPage } from "@/features/requests/types";
import { EmptyState } from "../shared/EmptyState";
import { useStatusRequests } from "./hooks/useStatusRequests";
import { StatusRequestCard } from "./StatusRequestCard";

// Type for non-pending statuses
type NonPendingStatus = Exclude<RequestStatus, "PENDING">;

interface StatusSectionProps {
	status: NonPendingStatus;
	search?: string;
	sortBy?: "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
}

export function StatusSection({
	status,
	search,
	sortBy,
	sortOrder,
}: StatusSectionProps) {
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useStatusRequests({
			status,
			search,
			sortBy,
			sortOrder,
		});

	const allRequests =
		data?.pages.flatMap((page) => (page as AdminRequestsPage).items) ?? [];
	const totalCount = allRequests.length;

	if (isLoading) {
		return <StatusSectionSkeleton />;
	}

	return (
		<div className="space-y-4 py-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{totalCount} {totalCount === 1 ? "request" : "requests"}
				</p>
			</div>

			{allRequests.length === 0 ? (
				<EmptyState message={`No ${status.toLowerCase()} requests found.`} />
			) : (
				<>
					<div className="grid gap-2">
						{allRequests.map((request) => (
							<StatusRequestCard key={request.id} request={request} />
						))}
					</div>

					{hasNextPage && (
						<div className="flex justify-center pt-4">
							<Button
								variant="outline"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? "Loading..." : "Load More"}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function StatusSectionSkeleton() {
	return (
		<div className="space-y-2 py-4">
			{[1, 2, 3].map((i) => (
				<Skeleton key={i} className="h-20 w-full" />
			))}
		</div>
	);
}
