import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpdateRequestStatusInput } from "@/features/requests/schemas/UpdateRequestStatus";
import { EmptyState } from "../shared/EmptyState";
import { PendingRequestCard } from "./PendingRequestCard";

interface PendingRequestsFeedProps {
	query: UseInfiniteQueryResult<any, any>;
	onProcess: (data: UpdateRequestStatusInput) => Promise<void>;
}

export function PendingRequestsFeed({
	query,
	onProcess,
}: PendingRequestsFeedProps) {
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		query;

	const allRequests = data?.pages.flatMap((page: any) => page.items) ?? [];
	const totalCount = allRequests.length;

	if (isLoading) {
		return <PendingFeedSkeleton />;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">
					Pending Requests
					{totalCount > 0 && (
						<span className="ml-2 text-muted-foreground">({totalCount})</span>
					)}
				</h2>
			</div>

			{allRequests.length === 0 ? (
				<EmptyState message="No pending requests. Great job!" />
			) : (
				<>
					<div className="grid gap-4">
						{allRequests.map((request: any) => (
							<PendingRequestCard
								key={request.id}
								request={request}
								onProcess={onProcess}
							/>
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

function PendingFeedSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-48" />
			{[1, 2, 3].map((i) => (
				<Skeleton key={i} className="h-64 w-full" />
			))}
		</div>
	);
}
