import { supabase } from "./client";

export const DEFAULT_STORAGE_BUCKET = "images";

type UploadImageOptions = {
	file: File;
	bucket?: string;
	pathPrefix?: string;
};

export async function uploadImage({
	file,
	bucket = DEFAULT_STORAGE_BUCKET,
	pathPrefix = "uploads",
}: UploadImageOptions) {
	const fileExt = file.name.split(".").pop() || "png";
	const fileName = `${crypto.randomUUID()}.${fileExt}`;
	const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

	const { error } = await supabase.storage
		.from(bucket)
		.upload(filePath, file, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		throw error;
	}

	const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

	return {
		publicUrl: data.publicUrl,
		path: filePath,
	};
}
