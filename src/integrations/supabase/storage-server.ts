import { getSupabaseServerClient } from "./server";
import { DEFAULT_STORAGE_BUCKET } from "./storage";

function resolveStoragePath(input: string, bucket: string) {
	if (!input) return input;

	try {
		const url = new URL(input);
		const marker = `/storage/v1/object/public/${bucket}/`;
		const index = url.pathname.indexOf(marker);
		if (index >= 0) {
			return url.pathname.slice(index + marker.length);
		}
	} catch {
		// Not a URL; assume it is already a storage path.
	}

	return input;
}

export async function deleteImageFromStorage(
	pathOrUrl: string,
	bucket = DEFAULT_STORAGE_BUCKET,
) {
	const supabase = getSupabaseServerClient();
	const resolvedPath = resolveStoragePath(pathOrUrl, bucket);
	const { error } = await supabase.storage.from(bucket).remove([resolvedPath]);
	if (error) {
		throw error;
	}
	return { success: true };
}

export function getStoragePublicUrl(
	pathOrUrl: string | null | undefined,
	bucket = DEFAULT_STORAGE_BUCKET,
) {
	if (!pathOrUrl) {
		return null;
	}

	const supabase = getSupabaseServerClient();
	const resolvedPath = resolveStoragePath(pathOrUrl, bucket);
	const { data } = supabase.storage.from(bucket).getPublicUrl(resolvedPath);
	return data.publicUrl;
}
