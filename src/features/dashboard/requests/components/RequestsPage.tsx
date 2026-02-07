import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	requestsMutationOptions,
	requestsQueryOptions,
} from "@/features/requests/options";
import type { RequestStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
import { CancelDialog } from "./CancelDialog";
import { DeleteDialog } from "./DeleteDialog";
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
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const cancelRequestMutation = useMutation(
		requestsMutationOptions.cancelRequest,
	);
	const deleteRequestMutation = useMutation(
		requestsMutationOptions.deleteUserRequest,
	);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
	} = useInfiniteQuery(
		requestsQueryOptions.getUserRequestsInfinite(activeFilter),
	);

	const allRequests = data?.pages.flatMap((page) => page.items) ?? [];

	const handleCancelClick = (id: string) => {
		setRequestToCancel(id);
		setCancelDialogOpen(true);
	};

	const handleDeleteClick = (id: string) => {
		setRequestToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleConfirmCancel = async () => {
		if (!requestToCancel) return;

		const { success, error } = await tryCatch(
			cancelRequestMutation.mutateAsync({ data: { id: requestToCancel } }),
		);

		if (!success) {
			toast.error(error);
		} else {
			toast.success("Request cancelled");
			queryClient.invalidateQueries({
				queryKey: ["userRequests", "infinite"],
			});
		}

		setCancelDialogOpen(false);
		setRequestToCancel(null);
	};

	const handleConfirmDelete = async () => {
		if (!requestToDelete) return;

		const { success, error } = await tryCatch(
			deleteRequestMutation.mutateAsync({ data: { id: requestToDelete } }),
		);

		if (!success) {
			toast.error(error || "Failed to delete request");
		} else {
			toast.success("Request deleted");
			queryClient.invalidateQueries({
				queryKey: ["userRequests", "infinite"],
			});
		}

		setDeleteDialogOpen(false);
		setRequestToDelete(null);
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
								onDelete={() => handleDeleteClick(request.id)}
								onEdit={() =>
									navigate({
										to: "/request/$id",
										params: { id: request.id },
										search: { edit: true },
									})
								}
								onView={() =>
									navigate({
										to: "/request/$id",
										params: { id: request.id },
									})
								}
								onChat={(orderId) =>
									navigate({
										to: "/chat/$orderId",
										params: { orderId },
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
			<DeleteDialog
				isOpen={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
