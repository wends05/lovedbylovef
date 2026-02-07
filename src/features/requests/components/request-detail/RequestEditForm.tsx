import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { useDropzone } from "@/components/ui/dropzone";
import {
	DropZoneArea,
	Dropzone,
	DropzoneDescription,
	DropzoneFileList,
	DropzoneFileListItem,
	DropzoneMessage,
	DropzoneTrigger,
} from "@/components/ui/dropzone";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Label } from "@/components/ui/label";
import type { RequestEditFormApi } from "../hooks/request-details";

type RequestEditFormProps = {
	form: RequestEditFormApi;
	dropzone: ReturnType<typeof useDropzone>;
	displayUrl: string | null;
	isUpdating: boolean;
	isUploading: boolean;
	onClear: () => void;
	onClose: () => void;
};

export function RequestEditForm({
	form,
	dropzone,
	displayUrl,
	isUpdating,
	isUploading,
	onClear,
	onClose,
}: RequestEditFormProps) {
	return (
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
									<Button type="button" variant="outline" onClick={onClear}>
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
						<Button type="button" variant="ghost" onClick={onClose}>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
