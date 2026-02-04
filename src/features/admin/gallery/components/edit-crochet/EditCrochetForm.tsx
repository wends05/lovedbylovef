"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_OPTIONS } from "@/features/admin/gallery/schemas/GalleryOptions";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { useSingleImageUpload } from "@/integrations/uploadthing/use-single-image-upload";
import { hashFile } from "@/lib/hash-file";
import { tryCatch } from "@/lib/try-catch";
import { Route } from "@/routes/admin/gallery/$id.edit";
import { adminDashboardQueryOptions } from "../../../options";
import { galleryMutationOptions } from "../../options";
import type { UpdateCrochetFormInput } from "../../schemas/CrochetSchemas";
import { UpdateCrochetFormSchema } from "../../schemas/CrochetSchemas";

export default function EditCrochetForm() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Get crochet data from route loader
	const { crochet } = Route.useLoaderData();
	const updateCrochetMutation = useMutation(
		galleryMutationOptions.updateCrochet,
	);
	const deleteCrochetImageMutation = useMutation(
		galleryMutationOptions.deleteCrochetImage,
	);

	// Set initial preview to existing image
	const initialImageUrl = crochet.imageURL;

	const defaultValues: UpdateCrochetFormInput = {
		id: crochet.id,
		name: crochet.name,
		description: crochet.description,
		category: crochet.category,
		price: crochet.price,
		imageURL: crochet.imageURL,
		imageKey: crochet.imageKey ?? undefined,
		imageHash: crochet.imageHash ?? undefined,
		isVisible: crochet.isVisible,
		file: undefined as unknown as File | undefined,
	};

	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: UpdateCrochetFormSchema,
		},
		onSubmit: async ({ value }) => {
			let didUploadNewImage = false;
			let imageUrl = value.imageURL;
			let imageKey = value.imageKey;
			let imageHash = value.imageHash;
			if (value.file) {
				if (isUploading) {
					return;
				}

				const nextHash = await hashFile(value.file);
				if (imageHash && nextHash === imageHash) {
					// Same file selected; skip upload.
				} else {
					const uploadedFile = await imageUpload.uploadFile();
					if (!uploadedFile) {
						toast.error("Image upload failed. Please try again.");
						return;
					}
					imageUrl = uploadedFile.ufsUrl;
					imageKey = uploadedFile.key;
					imageHash = nextHash;
					didUploadNewImage = true;
				}
			}

			const submitData = {
				id: value.id,
				name: value.name,
				description: value.description,
				category: value.category,
				price: value.price,
				imageURL: imageUrl,
				imageKey: imageKey,
				imageHash: imageHash,
				isVisible: value.isVisible,
			};

			const { success, error } = await tryCatch(
				updateCrochetMutation.mutateAsync({ data: submitData }),
			);

			if (!success) {
				toast.error("Failed to update crochet", {
					description: error || "Something went wrong",
				});
			} else {
				toast.success("Crochet updated successfully!");

				if (didUploadNewImage && value.imageKey) {
					const { error: deleteError } = await tryCatch(
						deleteCrochetImageMutation.mutateAsync({ data: value.imageKey }),
					);
					if (deleteError) {
						console.error(
							"Error deleting previous image after update:",
							deleteError,
						);
					}
				}

				// Invalidate gallery query
				await queryClient.invalidateQueries(
					adminDashboardQueryOptions.getAllCrochets,
				);

				// Navigate back to gallery
				navigate({ to: "/admin/gallery" });
			}
		},
	});

	const imageUpload = useSingleImageUpload({
		initialUrl: initialImageUrl,
		onFileChange: (file) => {
			form.setFieldValue("file", file);
		},
		onUploadBegin: () => {
			toast.info("Upload started...");
		},
		onUploadComplete: (res) => {
			console.log("Upload complete:", res);
			toast.success("Image uploaded successfully!");
		},
		onUploadError: (error) => {
			console.error("Upload error:", error);
			toast.error(`Upload failed: ${error.message}`);
		},
		accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
		maxSize: 4 * 1024 * 1024,
		maxFiles: 1,
		shiftOnMaxFiles: true,
	});

	const { dropzone, isUploading, previewUrl } = imageUpload;

	return (
		<div className="container mx-auto max-w-4xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Edit Crochet Item</CardTitle>
					<CardDescription>
						Update the details for &quot;{crochet.name}&quot;
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Left Column - Text Fields */}
							<div className="space-y-4">
								{/* Name Field */}
								<form.AppField name="name">
									{(field) => (
										<field.TextField
											label="Name"
											placeholder="Enter crochet name"
										/>
									)}
								</form.AppField>

								{/* Category Field */}
								<div>
									<form.AppField name="category">
										{(field) => (
											<field.SelectField
												items={CATEGORY_OPTIONS.map((option) => ({
													label: option.label,
													value: option.value,
												}))}
												label="Category"
												description="Select a category for the crochet item"
												placeholder="Select category"
											/>
										)}
									</form.AppField>
								</div>

								{/* Price Field */}
								<div>
									<form.AppField name="price">
										{(field) => (
											<field.NumberField
												label="Price (optional)"
												placeholder="Enter price"
												description="Leave empty for price on request"
											/>
										)}
									</form.AppField>
								</div>
							</div>

							{/* Right Column - Image Upload */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Image</Label>
									<Dropzone {...dropzone}>
										<DropZoneArea className="h-64 flex flex-col items-center justify-center">
											{dropzone.fileStatuses.length === 0 ? (
												<div className="flex flex-col items-center gap-2">
													<Camera className="h-12 w-12 text-muted-foreground" />
													<DropzoneDescription>
														Drop an image here or click to browse
													</DropzoneDescription>
													<p className="text-xs text-muted-foreground">
														JPG, PNG, GIF, WebP up to 4MB
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
																	{previewUrl && (
																		<img
																			src={previewUrl}
																			alt="Preview"
																			className="w-full h-32 object-cover rounded-md mt-2"
																		/>
																	)}
																</div>
																<DropzoneRemoveFile
																	size="icon"
																	variant="destructive"
																>
																	<X className="h-4 w-4" />
																</DropzoneRemoveFile>
															</div>
														</DropzoneFileListItem>
													))}
												</DropzoneFileList>
											)}
										</DropZoneArea>
										<DropzoneMessage className="mt-2" />
									</Dropzone>
								</div>

								{/* Visibility Toggle */}
								<div>
									<form.AppField name="isVisible">
										{(field) => (
											<div className="flex items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<Label htmlFor={field.name}>Visible in Gallery</Label>
													<p className="text-sm text-muted-foreground">
														Make this item visible to customers
													</p>
												</div>
												<Switch
													id={field.name}
													checked={field.state.value}
													onCheckedChange={field.handleChange}
												/>
											</div>
										)}
									</form.AppField>
								</div>
							</div>
						</div>

						{/* Description Field - Full Width */}
						<div>
							<form.AppField name="description">
								{(field) => (
									<field.TextareaField
										label="Description"
										placeholder="Describe your crochet item..."
										rows={4}
									/>
								)}
							</form.AppField>
						</div>

						{/* Submit Buttons */}
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/admin/gallery" })}
								disabled={form.state.isSubmitting || imageUpload.isUploading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={form.state.isSubmitting || imageUpload.isUploading}
							>
								{form.state.isSubmitting ? "Updating..." : "Update Crochet"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
