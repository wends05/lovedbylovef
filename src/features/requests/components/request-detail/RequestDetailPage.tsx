import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { DeleteDialog } from "@/features/dashboard/requests/components/DeleteDialog";
import { Route } from "@/routes/request.$id";
import { requestsQueryOptions } from "../../options";
import { REQUEST_STATUS_DETAIL_CONFIG } from "../../schemas/RequestOptions";
import {
	useRequestCancel,
	useRequestDelete,
	useRequestInvalidation,
	useRequestUpdate,
} from "../hooks/request-details";
import CancelConfirmationDialog from "./CancelConfirmationDialog";
import { RequestDetailHeader } from "./RequestDetailHeader";
import { RequestEditForm } from "./RequestEditForm";
import { RequestImageCard } from "./RequestImageCard";

export default function RequestDetailPage() {
	const { id } = useParams({ from: "/request/$id" });

	const router = useRouter();
	const { data: request } = useSuspenseQuery(
		requestsQueryOptions.getRequestById(id),
	);
	const search = Route.useSearch();
	const isPendingRequest = request.status === "PENDING";
	const canEdit = request.canEdit ?? isPendingRequest;
	const canCancel = request.canCancel ?? isPendingRequest;
	const canDelete =
		request.canDelete ??
		(request.status === "CANCELLED" || request.status === "REJECTED");
	const [isEditing, setIsEditing] = useState(Boolean(search.edit) && canEdit);

	const status = REQUEST_STATUS_DETAIL_CONFIG[request.status];
	const StatusIcon = status.icon;

	const { invalidateRequestQueries } = useRequestInvalidation(id);

	const navigateBackToRequests = () => {
		if (router.history.canGoBack()) {
			router.history.back();
			return;
		}

		router.navigate({ to: "/requests" });
	};

	const { form, dropzone, displayUrl, isUploading, isUpdating, clear } =
		useRequestUpdate({
			request: {
				id: request.id,
				title: request.title,
				description: request.description,
				imagePath: request.imagePath,
				imageUrl: request.imageUrl,
			},
			onInvalidate: invalidateRequestQueries,
			onSuccess: () => setIsEditing(false),
		});

	const { cancelDialogOpen, setCancelDialogOpen, isCancelling, handleCancel } =
		useRequestCancel({
			requestId: id,
			onCancelled: invalidateRequestQueries,
		});

	const { deleteDialogOpen, setDeleteDialogOpen, isDeleting, handleDelete } =
		useRequestDelete({
			requestId: id,
			onDeleted: () => {
				router.navigate({ to: "/requests" });
			},
		});

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<RequestDetailHeader
				title={request.title}
				createdAt={request.createdAt}
				statusLabel={status.label}
				statusColor={status.color}
				statusBgColor={status.bgColor}
				StatusIcon={StatusIcon}
				onBack={navigateBackToRequests}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column - Image & Basic Info */}
				<div className="space-y-6">
					{/* Image */}
					<RequestImageCard imageUrl={request.imageUrl} title={request.title} />

					{/* Status Info */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Status Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground">{status.description}</p>

							{request.approvedAt && (
								<div className="text-sm">
									<span className="text-muted-foreground">Approved on: </span>
									<span className="font-medium">
										{format(
											new Date(request.approvedAt),
											"MMM d, yyyy 'at' h:mm a",
										)}
									</span>
								</div>
							)}

							<Separator />

							{/* Action Buttons */}
							{canEdit && (
								<div className="space-y-2">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => setIsEditing((prev) => !prev)}
										disabled={isUpdating || isUploading}
									>
										{isEditing ? "Close Edit" : "Edit Request"}
									</Button>
									{canCancel && (
										<Button
											variant="destructive"
											className="w-full"
											onClick={() => setCancelDialogOpen(true)}
											disabled={isCancelling}
										>
											{isCancelling ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Cancelling...
												</>
											) : (
												<>
													<X className="w-4 h-4 mr-2" />
													Cancel Request
												</>
											)}
										</Button>
									)}
								</div>
							)}
							{canDelete && (
								<div className="space-y-2">
									<Button
										variant="destructive"
										className="w-full"
										onClick={() => setDeleteDialogOpen(true)}
										disabled={isDeleting}
									>
										{isDeleting ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Deleting...
											</>
										) : (
											<>
												<X className="w-4 h-4 mr-2" />
												Delete Request
											</>
										)}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details & Admin Response */}
				<div className="space-y-6">
					{/* Edit Request */}
					{isPendingRequest && isEditing && (
						<RequestEditForm
							form={form}
							dropzone={dropzone}
							displayUrl={displayUrl}
							isUpdating={isUpdating}
							isUploading={isUploading}
							onClear={clear}
							onClose={() => setIsEditing(false)}
						/>
					)}

					{/* If Not Editing, display the information */}
					{!isEditing && (
						<>
							{/* Description */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Description</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground whitespace-pre-wrap">
										{request.description || "No description provided"}
									</p>
								</CardContent>
							</Card>

							{/* Admin Response */}
							{request.adminResponse && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Admin Response</CardTitle>
										<CardDescription>Response from admin</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="bg-muted/50 rounded-lg p-4">
											<p className="text-sm whitespace-pre-wrap">
												{request.adminResponse}
											</p>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Request Details */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Request Details</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Request ID</span>
										<span className="font-mono text-xs">{request.id}</span>
									</div>
									<Separator />
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Submitted</span>
										<span>
											{format(new Date(request.createdAt), "MMM d, yyyy")}
										</span>
									</div>
									<Separator />
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Last Updated</span>
										<span>
											{format(new Date(request.updatedAt), "MMM d, yyyy")}
										</span>
									</div>
								</CardContent>
							</Card>
						</>
					)}
				</div>
			</div>

			{/* Cancel Confirmation Dialog */}
			<CancelConfirmationDialog
				cancelDialogOpen={cancelDialogOpen}
				setCancelDialogOpen={setCancelDialogOpen}
				handleCancel={handleCancel}
				isCancelling={isCancelling}
			/>
			<DeleteDialog
				isOpen={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
