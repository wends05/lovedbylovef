import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import {
	assertStorageDeleteAccess,
	deleteStorageImageServerOnly,
	type StorageScope,
} from "./server-only";

export const DeleteStorageImageSchema = z.object({
	path: z.string().min(1),
	scope: z.enum(["requests", "crochets"]),
});

export const deleteStorageImage = createServerFn({ method: "POST" })
	.inputValidator(DeleteStorageImageSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();
		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		await assertStorageDeleteAccess(
			data.scope as StorageScope,
			authData.user.id,
		);
		return deleteStorageImageServerOnly(data);
	});
