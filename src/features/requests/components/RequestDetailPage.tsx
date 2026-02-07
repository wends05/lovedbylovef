import { revalidateLogic } from "@tanstack/react-form";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Loader2, Package, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropZoneArea,
	Dropzone,
	DropzoneDescription,
	DropzoneFileList,
	DropzoneFileListItem,
	DropzoneMessage,
	DropzoneRemoveFile,
	DropzoneTrigger,
} from "@/components/ui/dropzone";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RequestStatus } from "@/generated/prisma/enums";
import { useSingleImageUpload } from "@/integrations/supabase/use-single-image-upload";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";
import { Route } from "@/routes/_protected/request.$id";
import { requestsMutationOptions, requestsQueryOptions } from "../options";
import {
	type UpdateRequestFormInput,
	UpdateRequestFormSchema,
	UpdateRequestSubmissionSchema,
} from "../schemas/RequestForm";
import { REQUEST_STATUS_DETAIL_CONFIG } from "../schemas/RequestOptions";

export default function RequestDetailPage() {
	const { id } = useParams({ from: "/_protected/request/$id" });

	const router = useRouter();
	const { data: request } = useSuspenseQuery(
		requestsQueryOptions.getRequestById(id),
	);
	const search = Route.useSearch();
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [isEditing, setIsEditing] = useState(
		Boolean(search.edit) && request.status === "PENDING",
	);
	const queryClient = useQueryClient();
	const cancelRequestMutation = useMutation(
		requestsMutationOptions.cancelRequest,
	);
	const updateRequestMutation = useMutation(
		requestsMutationOptions.updateUserRequest,
	);
	const deleteImageMutation = useMutation(requestsMutationOptions.deleteImage);

	const status = REQUEST_STATUS_DETAIL_CONFIG[request.status];
	const StatusIcon = status.icon;

	const defaultValues: UpdateRequestFormInput = {
		id: request.id,
		title: request.title,
		description: request.description,
		file: undefined,
	};

	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: UpdateRequestFormSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			const previousImageKey = request.imageKey ?? undefined;
			let imageUrl = request.imageUrl ?? undefined;
			let imageKey = request.imageKey ?? undefined;
			let didUploadNewImage = false;
			let uploadedImageKey: string | undefined;

			if (value.file) {
				if (imageUpload.isUploading) {
					return;
				}

				const uploadedFile = await imageUpload.uploadFile();
				if (!uploadedFile) {
					toast.error("Image upload failed. Please try again.");
					return;
				}

				imageUrl = uploadedFile.publicUrl;
				imageKey = uploadedFile.path;
				uploadedImageKey = uploadedFile.path;
				didUploadNewImage = true;
			}

			const submitData = UpdateRequestSubmissionSchema.parse({
				id: value.id,
				title: value.title,
				description: value.description,
				imageUrl,
				imageKey,
			});

			const { success, error } = await tryCatch(
				updateRequestMutation.mutateAsync({ data: submitData }),
			);

			if (!success) {
				toast.error("Failed to update request", {
					description: error || "Something went wrong",
				});

				if (uploadedImageKey) {
					await tryCatch(
						deleteImageMutation.mutateAsync({ data: uploadedImageKey }),
					);
				}

				return;
			}

			toast.success("Request updated successfully!");

			if (
				didUploadNewImage &&
				previousImageKey &&
				previousImageKey !== imageKey
			) {
				await tryCatch(
					deleteImageMutation.mutateAsync({ data: previousImageKey }),
				);
			}

			await queryClient.invalidateQueries(
				requestsQueryOptions.getRequestById(id),
			);

			const statuses: Array<RequestStatus | "ALL"> = [
				"ALL",
				RequestStatus.PENDING,
				RequestStatus.APPROVED,
				RequestStatus.REJECTED,
				RequestStatus.COMPLETED,
				RequestStatus.CANCELLED,
			];

			await Promise.all(
				statuses.map((statusKey) =>
					queryClient.invalidateQueries(
						requestsQueryOptions.getUserRequestsInfinite(statusKey),
					),
				),
			);

			formApi.reset();
			imageUpload.clear();
			setIsEditing(false);
		},
	});

	const imageUpload = useSingleImageUpload({
		pathPrefix: "requests",
		initialUrl: request.imageUrl,
		onFileChange: (file) => {
			form.setFieldValue("file", file);
		},
		onUploadBegin: () => {
			toast.info("Upload started...");
		},
		onUploadComplete: () => {
			toast.success("Image uploaded successfully!");
		},
		onUploadError: (error) => {
			toast.error(`Upload failed: ${error.message}`);
		},
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
		},
		maxSize: 8 * 1024 * 1024,
		maxFiles: 1,
		shiftOnMaxFiles: true,
	});

	const { dropzone, displayUrl, isUploading } = imageUpload;
	const isUpdating = updateRequestMutation.isPending;

	const handleCancel = async () => {
		setIsCancelling(true);

		const { success, error } = await tryCatch(
			cancelRequestMutation.mutateAsync({ data: { id } }),
		);

		if (!success) {
			toast.error("Error", {
				description: error || "Failed to cancel request",
			});
		} else {
			toast.success("Request cancelled", {
				description: "Your request has been cancelled successfully.",
			});
			// Invalidate queries
			await queryClient.invalidateQueries(
				requestsQueryOptions.getRequestById(id),
			);

			const statuses: Array<RequestStatus | "ALL"> = [
				"ALL",
				RequestStatus.PENDING,
				RequestStatus.APPROVED,
				RequestStatus.REJECTED,
				RequestStatus.COMPLETED,
				RequestStatus.CANCELLED,
			];

			await Promise.all(
				statuses.map((statusKey) =>
					queryClient.invalidateQueries(
						requestsQueryOptions.getUserRequestsInfinite(statusKey),
					),
				),
			);
		}

		setIsCancelling(false);
		setCancelDialogOpen(false);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<Button
					variant="ghost"
					size="sm"
					className="mb-4 -ml-2"
					onClick={() => {
						if (router.history.canGoBack()) {
							router.history.back();
						} else {
							router.navigate({ to: "/requests" });
						}
					}}
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{request.title}
						</h1>
						<p className="text-muted-foreground">
							Submitted{" "}
							{formatDistanceToNow(new Date(request.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>

					{/* Status Badge */}
					<div
						className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${status.bgColor}`}
					>
						<StatusIcon className={`w-5 h-5 ${status.color}`} />
						<span className={`font-semibold ${status.color}`}>
							{status.label}
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column - Image & Basic Info */}
				<div className="space-y-6">
					{/* Image */}
					<Card className="overflow-hidden">
						<ImageZoom>
							<AspectRatio ratio={4 / 3}>
								{request.imageUrl ? (
									<img
										src={request.imageUrl}
										alt={request.title}
										className="object-cover w-full h-full"
									/>
								) : (
									<div className="w-full h-full bg-muted flex items-center justify-center">
										<Package className="w-16 h-16 text-muted-foreground/50" />
									</div>
								)}
							</AspectRatio>
						</ImageZoom>
					</Card>

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
							{request.status === "PENDING" && (
								<div className="space-y-2">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => setIsEditing((prev) => !prev)}
										disabled={isUpdating || isUploading}
									>
										{isEditing ? "Close Edit" : "Edit Request"}
									</Button>
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
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details & Admin Response */}
				<div className="space-y-6">
					{/* Edit Request */}
					{request.status === "PENDING" && isEditing && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Edit Request</CardTitle>
								<CardDescription>
									Update your request while it is still pending review.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
									className="space-y-4"
								>
									<form.AppField name="title">
										{(field) => (
											<field.TextField
												label="Title"
												placeholder="Enter request title"
											/>
										)}
									</form.AppField>
									<form.AppField name="description">
										{(field) => (
											<field.TextareaField
												label="Description"
												placeholder="Describe your request"
											/>
										)}
									</form.AppField>
									<form.AppField name="file">
										{() => (
											<div className="space-y-3">
												<Label>Image</Label>
												<Dropzone {...dropzone}>
													<DropZoneArea className="h-56 flex flex-col items-center justify-center">
														{dropzone.fileStatuses.length === 0 ? (
															<div className="flex flex-col items-center gap-2">
																<DropzoneDescription>
																	Drop an image here or click to browse
																</DropzoneDescription>
																<p className="text-xs text-muted-foreground">
																	JPG, PNG, GIF, WebP up to 8MB
																</p>
																<DropzoneTrigger>Select Image</DropzoneTrigger>
															</div>
														) : (
															<DropzoneFileList className="w-full">
																{dropzone.fileStatuses.map((fileStatus) => (
																	<DropzoneFileListItem
																		key={fileStatus.id}
																		file={fileStatus}
																	>
																		<div className="flex items-center justify-between w-full">
																			<div className="flex-1 min-w-0">
																				<p className="text-sm font-medium truncate">
																					{fileStatus.fileName}
																				</p>
																				<DropzoneMessage />
																			</div>
																		</div>
																	</DropzoneFileListItem>
																))}
															</DropzoneFileList>
														)}
													</DropZoneArea>
												</Dropzone>
												{displayUrl && (
													<div className="rounded-lg overflow-hidden border border-border bg-muted/50">
														<ImageZoom>
															<img
																src={displayUrl}
																alt="Request preview"
																className="w-full h-46 object-contain"
															/>
														</ImageZoom>
													</div>
												)}
												{dropzone.fileStatuses.length > 0 && (
													<Button
														type="button"
														variant="outline"
														onClick={() => imageUpload.clear()}
													>
														<X />
													</Button>
												)}
											</div>
										)}
									</form.AppField>
									<div className="flex items-center gap-2">
										<Button type="submit" disabled={isUpdating || isUploading}>
											{isUpdating ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Updating...
												</>
											) : (
												"Save Changes"
											)}
										</Button>
										<Button
											type="button"
											variant="ghost"
											onClick={() => setIsEditing(false)}
										>
											Cancel
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

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
										<CardDescription>
											Response from the crochet team
										</CardDescription>
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
			<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Request</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this request? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCancelDialogOpen(false)}
							disabled={isCancelling}
						>
							Keep Request
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancel}
							disabled={isCancelling}
						>
							{isCancelling ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Cancelling...
								</>
							) : (
								"Cancel Request"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
