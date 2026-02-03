import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { RequestStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
import { requestsOptions } from "../options";
import { cancelRequest } from "../server";
import { CancelDialog } from "./CancelDialog";
import { EmptyState } from "./EmptyState";
import { RequestCard } from "./RequestCard";
import { RequestSkeleton } from "./RequestSkeleton";
import { StatusFilters, statusConfig } from "./StatusFilters";

export default function RequestsPage() {
	const [activeFilter, setActiveFilter] = useState<RequestStatus | "ALL">(
		"ALL",
	);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [requestToCancel, setRequestToCancel] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
	} = useInfiniteQuery(requestsOptions.getUserRequestsInfinite(activeFilter));

	const allRequests = data?.pages.flatMap((page) => page.items) ?? [];

	const handleCancelClick = (id: string) => {
		setRequestToCancel(id);
		setCancelDialogOpen(true);
	};

	const handleConfirmCancel = async () => {
		if (!requestToCancel) return;

		const { success, error } = await tryCatch(
			cancelRequest({ data: { id: requestToCancel } }),
		);

		if (!success) {
			toast.error(error);
		} else {
			toast.success("Request cancelled", {
				description: "Your request has been cancelled successfully.",
			});
			queryClient.invalidateQueries({
				queryKey: ["userRequests", "infinite"],
			});
		}

		setCancelDialogOpen(false);
		setRequestToCancel(null);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-foreground mb-2 font-display">
						Your Requests
					</h1>
					<p className="text-muted-foreground">
						Track and manage your crochet order requests
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => refetch()}
					disabled={isLoading}
				>
					<RefreshCw
						className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			{/* Status Filters */}
			<div className="mb-8">
				<StatusFilters
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
				/>
			</div>

			{/* Content */}
			{isLoading ? (
				<RequestSkeleton count={6} />
			) : allRequests.length === 0 ? (
				<EmptyState
					activeFilter={activeFilter}
					onViewAll={() => setActiveFilter("ALL")}
					statusLabel={statusConfig[activeFilter].label}
				/>
			) : (
				<>
					{/* Requests Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{allRequests.map((request) => (
							<RequestCard
								key={request.id}
								request={request}
								onCancel={() => handleCancelClick(request.id)}
								onView={() =>
									navigate({
										to: "/request/$id",
										params: { id: request.id },
									})
								}
							/>
						))}
					</div>

					{/* Load More */}
					{hasNextPage && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
								size="lg"
							>
								{isFetchingNextPage ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Loading...
									</>
								) : (
									"Load More"
								)}
							</Button>
						</div>
					)}
				</>
			)}

			{/* Cancel Confirmation Dialog */}
			<CancelDialog
				isOpen={cancelDialogOpen}
				onOpenChange={setCancelDialogOpen}
				onConfirm={handleConfirmCancel}
			/>
		</div>
	);
}
