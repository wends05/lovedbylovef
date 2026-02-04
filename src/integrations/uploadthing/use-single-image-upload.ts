import { useCallback, useEffect, useMemo, useState } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "@/components/ui/dropzone";
import { useUploadThing } from "./react-helpers";

type UploadedImage = {
	ufsUrl: string;
	key: string;
};

type UseSingleImageUploadOptions = {
	initialUrl?: string | null;
	accept?: Accept;
	maxSize?: number;
	maxFiles?: number;
	shiftOnMaxFiles?: boolean;
	onFileChange?: (file: File | undefined) => void;
	onUploadBegin?: () => void;
	onUploadComplete?: (files: UploadedImage[]) => void;
	onUploadError?: (error: Error) => void;
};

type UseSingleImageUploadReturn = {
	dropzone: ReturnType<typeof useDropzone>;
	previewUrl: string | null;
	displayUrl: string | null;
	file: File | undefined;
	isUploading: boolean;
	uploadFile: () => Promise<UploadedImage | null>;
	clear: () => void;
};

export function useSingleImageUpload(
	options: UseSingleImageUploadOptions = {},
): UseSingleImageUploadReturn {
	const {
		initialUrl,
		accept,
		maxSize,
		maxFiles = 1,
		shiftOnMaxFiles = true,
		onFileChange,
		onUploadBegin,
		onUploadComplete,
		onUploadError,
	} = options;

	const [file, setFile] = useState<File | undefined>(undefined);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const uploadThing = useUploadThing("imageUploader", {
		onClientUploadComplete: (res) => {
			onUploadComplete?.(res as UploadedImage[]);
		},
		onUploadError: (error) => {
			onUploadError?.(error);
		},
		onUploadBegin: () => {
			onUploadBegin?.();
		},
	});

	const setFileAndPreview = useCallback(
		(nextFile?: File) => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			const nextPreview = nextFile ? URL.createObjectURL(nextFile) : null;
			setPreviewUrl(nextPreview);
			setFile(nextFile);
			onFileChange?.(nextFile);
			return nextPreview;
		},
		[onFileChange, previewUrl],
	);

	const dropzone = useDropzone({
		onDropFile: async (nextFile) => {
			const nextPreview = setFileAndPreview(nextFile);
			return {
				status: "success",
				result: nextPreview ?? "",
			};
		},
		onRemoveFile: async () => {
			setFileAndPreview(undefined);
		},
		validation: {
			accept,
			maxSize,
			maxFiles,
		},
		shiftOnMaxFiles,
	});

	const uploadFile = useCallback(async () => {
		if (!file || uploadThing.isUploading) {
			return null;
		}
		const files = await uploadThing.startUpload([file]);
		if (!files || files.length === 0) {
			return null;
		}
		return files[0] as UploadedImage;
	}, [file, uploadThing.isUploading, uploadThing.startUpload]);

	const clear = useCallback(() => {
		dropzone.fileStatuses.forEach((status) => {
			dropzone.onRemoveFile(status.id);
		});
		setFileAndPreview(undefined);
	}, [dropzone, setFileAndPreview]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const displayUrl = useMemo(() => {
		return previewUrl ?? initialUrl ?? null;
	}, [previewUrl, initialUrl]);

	return {
		dropzone,
		previewUrl,
		displayUrl,
		file,
		isUploading: uploadThing.isUploading,
		uploadFile,
		clear,
	};
}
