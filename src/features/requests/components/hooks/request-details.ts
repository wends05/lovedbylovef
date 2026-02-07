import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { storageMutationOptions } from "@/features/storage/options";
import { useSingleImageUpload } from "@/integrations/supabase/use-single-image-upload";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";
import { requestsMutationOptions, requestsQueryOptions } from "../../options";
import {
	type UpdateRequestFormInput,
	UpdateRequestFormSchema,
	UpdateRequestSubmissionSchema,
} from "../../schemas/RequestForm";
import { REQUEST_STATUSES_FOR_INVALIDATION } from "../../schemas/RequestOptions";

type UseRequestCancelOptions = {
	requestId: string;
	onCancelled: () => Promise<void>;
};

type UseRequestDeleteOptions = {
	requestId: string;
	onDeleted: () => void;
};

type RequestUpdateData = {
	id: string;
	title: string;
	description: string;
	imagePath?: string | null;
	imageUrl?: string | null;
};

type UseRequestUpdateOptions = {
	request: RequestUpdateData;
	onSuccess: () => void;
	onInvalidate: () => Promise<void>;
};

export function useRequestInvalidation(requestId: string) {
	const queryClient = useQueryClient();

	const invalidateRequestQueries = async () => {
		await queryClient.invalidateQueries(
			requestsQueryOptions.getRequestById(requestId),
		);

		await Promise.all(
			REQUEST_STATUSES_FOR_INVALIDATION.map((statusKey) =>
				queryClient.invalidateQueries(
					requestsQueryOptions.getUserRequestsInfinite(statusKey),
				),
			),
		);
	};

	return { invalidateRequestQueries };
}

export function useRequestCancel({
	requestId,
	onCancelled,
}: UseRequestCancelOptions) {
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const cancelRequestMutation = useMutation(
		requestsMutationOptions.cancelRequest,
	);

	const handleCancel = async () => {
		setIsCancelling(true);

		const { success, error } = await tryCatch(
			cancelRequestMutation.mutateAsync({ data: { id: requestId } }),
		);

		if (!success) {
			toast.error("Error", {
				description: error || "Failed to cancel request",
			});
		} else {
			toast.success("Request cancelled", {
				description: "Your request has been cancelled successfully.",
			});
			await onCancelled();
		}

		setIsCancelling(false);
		setCancelDialogOpen(false);
	};

	return {
		cancelDialogOpen,
		setCancelDialogOpen,
		isCancelling,
		handleCancel,
	};
}

export function useRequestDelete({
	requestId,
	onDeleted,
}: UseRequestDeleteOptions) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const deleteRequestMutation = useMutation(
		requestsMutationOptions.deleteUserRequest,
	);

	const handleDelete = async () => {
		setIsDeleting(true);

		const { success, error } = await tryCatch(
			deleteRequestMutation.mutateAsync({ data: { id: requestId } }),
		);

		if (!success) {
			toast.error("Failed to delete request", {
				description: error || "Something went wrong",
			});
			setIsDeleting(false);
			return;
		}

		toast.success("Request deleted", {
			description: "Your request has been deleted successfully.",
		});
		setIsDeleting(false);
		setDeleteDialogOpen(false);
		onDeleted();
	};

	return {
		deleteDialogOpen,
		setDeleteDialogOpen,
		isDeleting,
		handleDelete,
	};
}

export function useRequestUpdate({
	request,
	onSuccess,
	onInvalidate,
}: UseRequestUpdateOptions) {
	const updateRequestMutation = useMutation(
		requestsMutationOptions.updateUserRequest,
	);
	const deleteStorageImageMutation = useMutation(
		storageMutationOptions.deleteStorageImage,
	);

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
			let imagePath = request.imagePath ?? undefined;
			let uploadedImagePath: string | undefined;

			if (value.file) {
				if (isUploading) {
					return;
				}

				const uploadedFile = await uploadFile();
				if (!uploadedFile) {
					toast.error("Image upload failed. Please try again.");
					return;
				}

				imagePath = uploadedFile.path;
				uploadedImagePath = uploadedFile.path;
			}

			const submitData = UpdateRequestSubmissionSchema.parse({
				id: value.id,
				title: value.title,
				description: value.description,
				imagePath,
			});

			const { success, error } = await tryCatch(
				updateRequestMutation.mutateAsync({ data: submitData }),
			);

			if (!success) {
				toast.error("Failed to update request", {
					description: error || "Something went wrong",
				});

				if (uploadedImagePath) {
					await tryCatch(
						deleteStorageImageMutation.mutateAsync({
							data: { path: uploadedImagePath, scope: "requests" },
						}),
					);
				}

				return;
			}

			toast.success("Request updated successfully!");
			await onInvalidate();

			formApi.reset();
			clear();
			onSuccess();
		},
	});

	const { dropzone, displayUrl, isUploading, uploadFile, clear } =
		useSingleImageUpload({
			pathPrefix: "requests",
			initialUrl: request.imageUrl ?? undefined,
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

	return {
		form,
		dropzone,
		displayUrl,
		isUploading,
		isUpdating: updateRequestMutation.isPending,
		clear,
	};
}

export type RequestEditFormApi = ReturnType<typeof useRequestUpdate>["form"];
