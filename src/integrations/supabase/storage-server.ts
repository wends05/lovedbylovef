import { getSupabaseServerClient } from "./server";
import { DEFAULT_STORAGE_BUCKET } from "./storage";

export async function deleteImageFromStorage(
	path: string,
	bucket = DEFAULT_STORAGE_BUCKET,
) {
	const supabase = getSupabaseServerClient();
	const { error } = await supabase.storage.from(bucket).remove([path]);
	if (error) {
		throw error;
	}
	return { success: true };
}
