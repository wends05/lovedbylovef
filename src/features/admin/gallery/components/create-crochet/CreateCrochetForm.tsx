import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { storageMutationOptions } from "@/features/storage/options";
import { Category } from "@/generated/prisma/enums";
import { useSingleImageUpload } from "@/integrations/supabase/use-single-image-upload";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { hashFile } from "@/lib/hash-file";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardQueryOptions } from "../../../options";
import { galleryMutationOptions } from "../../options";
import type { CreateCrochetFormInput } from "../../schemas/CrochetSchemas";
import { CreateCrochetFormSchema } from "../../schemas/CrochetSchemas";

const defaultValues: CreateCrochetFormInput = {
	name: "",
	description: "",
	category: Category.TOY,
	price: null,
	imagePath: undefined,
	isVisible: true,
	file: undefined as unknown as File,
};

export default function CreateCrochetForm() {
	const queryClient = useQueryClient();
	const createCrochetMutation = useMutation(
		galleryMutationOptions.createCrochet,
	);
	const deleteStorageImageMutation = useMutation(
		storageMutationOptions.deleteStorageImage,
	);

	const form = useAppForm({
		defaultValues: defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: CreateCrochetFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!value.file) {
				toast.error("Please upload an image");
				return;
			}

			const uploadedFile = await imageUpload.uploadFile();
			if (!uploadedFile) {
				toast.error("Image upload failed. Please try again.");
				return;
			}

			const submitData = {
				name: value.name,
				description: value.description,
				category: value.category,
				price: value.price,
				imagePath: uploadedFile.path,
				imageHash: await hashFile(value.file),
				isVisible: value.isVisible,
			};

			const { success, error } = await tryCatch(
				createCrochetMutation.mutateAsync({ data: submitData }),
			);

			if (!success) {
				toast.error("Failed to create crochet", {
					description: error || "Something went wrong",
				});

				const { error: deleteError } = await tryCatch(
					deleteStorageImageMutation.mutateAsync({
						data: { path: uploadedFile.path, scope: "crochets" },
					}),
				);
				if (deleteError) {
					console.error(
						"Error deleting uploaded crochet image after failed create:",
						deleteError,
					);
				}
			} else {
				toast.success("Crochet created successfully!");

				// Reset form and image
				form.reset();
				imageUpload.clear();

				// Invalidate gallery query
				await queryClient.invalidateQueries(
					adminDashboardQueryOptions.getAllCrochets,
				);
			}
		},
	});

	const imageUpload = useSingleImageUpload({
		pathPrefix: "crochets",
		onFileChange: (file) => {
			form.setFieldValue("file", (file ?? undefined) as unknown as File);
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

	const { dropzone, previewUrl, isUploading } = imageUpload;

	return (
		<div className="container mx-auto max-w-4xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create New Crochet Item</CardTitle>
					<CardDescription>
						Add a new crochet item to your gallery. Fill in the details and
						upload an image.
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
						<form.AppField name="description">
							{(field) => (
								<field.TextareaField
									label="Description"
									placeholder="Describe your crochet item..."
									rows={4}
								/>
							)}
						</form.AppField>

						{/* Submit Button */}
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									form.reset();
									imageUpload.clear();
								}}
								disabled={form.state.isSubmitting || isUploading}
							>
								Reset
							</Button>
							<form.AppForm>
								<form.SubmitButton
									label="Submit"
									isSubmittingLabel="Submitting"
									disabled={form.state.isSubmitting || isUploading}
								/>
							</form.AppForm>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
