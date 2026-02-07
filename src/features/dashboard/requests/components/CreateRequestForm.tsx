import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropZoneArea,
	Dropzone,
	DropzoneTrigger,
} from "@/components/ui/dropzone";
import { FieldError } from "@/components/ui/field";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Label } from "@/components/ui/label";
import { requestsMutationOptions } from "@/features/requests/options";
import {
	type RequestFormInput,
	RequestFormSchema,
	RequestFormSubmission,
} from "@/features/requests/schemas/RequestForm";
import { storageMutationOptions } from "@/features/storage/options";
import { useSingleImageUpload } from "@/integrations/supabase/use-single-image-upload";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";

const defaultValues: RequestFormInput = {
	title: "",
	description: "",
	file: undefined,
};

export default function CreateRequestForm() {
	const submitRequestMutation = useMutation(
		requestsMutationOptions.submitRequest,
	);
	const deleteStorageImageMutation = useMutation(
		storageMutationOptions.deleteStorageImage,
	);
	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: RequestFormSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			let imagePath: string | undefined;

			if (value.file) {
				if (imageUpload.isUploading) {
					return;
				}

				const uploadedFile = await imageUpload.uploadFile();
				if (uploadedFile) {
					imagePath = uploadedFile.path;
				}
			}
			const finalData = RequestFormSubmission.parse({
				title: value.title,
				description: value.description,
				imagePath,
			});

			const { error } = await tryCatch(
				submitRequestMutation.mutateAsync({ data: finalData }),
			);
			if (error) {
				toast.error("Submission failed. Please try again.");

				// Delete the uploaded file if submission fails
				if (finalData.imagePath) {
					const { error: deleteError } = await tryCatch(
						deleteStorageImageMutation.mutateAsync({
							data: { path: finalData.imagePath, scope: "requests" },
						}),
					);
					if (deleteError) {
						console.error(
							"Error deleting image after failed submission:",
							deleteError,
						);
					}
				}
				return;
			}

			// Success! Clear the form
			toast.success("Request submitted successfully!");
			formApi.reset();
			imageUpload.clear();
		},
	});

	const imageUpload = useSingleImageUpload({
		pathPrefix: "requests",
		onFileChange: (file) => {
			form.setFieldValue("file", file);
		},
		onUploadBegin: () => {
			toast.info("Upload started...");
		},
		onUploadComplete: (res) => {
			console.log("Upload complete:", res);
			toast.success("File uploaded successfully!");
		},
		onUploadError: (error) => {
			console.error("Upload error:", error);
			toast.error(`Upload failed: ${error.message}`);
		},
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxSize: 8 * 1024 * 1024,
		maxFiles: 1,
		shiftOnMaxFiles: true,
	});

	const { dropzone, previewUrl, isUploading } = imageUpload;

	const handleRemoveImage = () => {
		imageUpload.clear();
	};

	return (
		<Card className="max-w-2xl ">
			<CardHeader>
				<CardTitle>Request An Order</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField name="title">
						{(field) => (
							<field.TextField
								label="Title"
								description="Enter the title of your request"
							/>
						)}
					</form.AppField>
					<form.AppField name="description">
						{(field) => (
							<field.TextareaField
								label="Description"
								description="Add more context to your crochet request."
							/>
						)}
					</form.AppField>
					<form.AppField name="file">
						{(field) => (
							<div className="space-y-4">
								<Label>Upload Reference Image (optional)</Label>
								<Dropzone {...dropzone}>
									<DropZoneArea className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
										<DropzoneTrigger className="flex flex-col items-center gap-2 cursor-pointer">
											<Upload className="h-8 w-8 text-muted-foreground" />
											<div className="text-center">
												<p className="text-sm font-medium">
													Click to upload or drag and drop
												</p>
												<p className="text-xs text-muted-foreground">
													{dropzone
														.getInputProps()
														.accept?.split(",")
														.join(", ") || "Accepted file types"}{" "}
												</p>
												<p>Max size: 8MB</p>
											</div>
										</DropzoneTrigger>
									</DropZoneArea>
								</Dropzone>

								{/* Image Preview */}
								{previewUrl && (
									<>
										<div className="relative rounded-lg overflow-hidden border border-border bg-muted/50">
											<ImageZoom>
												<img
													src={previewUrl}
													alt="Preview"
													className="w-full h-46 object-contain"
												/>
											</ImageZoom>
										</div>
										<Button
											type="button"
											variant="destructive"
											onClick={handleRemoveImage}
										>
											Clear Image
										</Button>
									</>
								)}
								{field.state.meta.errors && (
									<FieldError errors={field.state.meta.errors} />
								)}
							</div>
						)}
					</form.AppField>
					<form.AppForm>
						<form.SubmitButton label="Submit" disabled={isUploading} />
					</form.AppForm>
				</form>
			</CardContent>
			<CardFooter>
				<Alert>
					<AlertTitle>Note</AlertTitle>
					<AlertDescription>
						Your request will be reviewed and you will be contacted back here.
						Please check from time to time.
					</AlertDescription>
				</Alert>
			</CardFooter>
		</Card>
	);
}
