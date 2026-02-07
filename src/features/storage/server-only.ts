import { deleteImageFromStorage } from "@/integrations/supabase/storage-server";
import { prisma } from "@/lib/prisma-client";

export type StorageScope = "requests" | "crochets";

const STORAGE_SCOPE_PREFIX: Record<StorageScope, string> = {
	requests: "requests/",
	crochets: "crochets/",
};

export function assertStoragePathMatchesScope(
	path: string,
	scope: StorageScope,
) {
	const expectedPrefix = STORAGE_SCOPE_PREFIX[scope];
	if (!path.startsWith(expectedPrefix)) {
		throw new Error("Invalid image path");
	}
}

export async function assertStorageDeleteAccess(
	scope: StorageScope,
	userId: string,
) {
	if (scope === "requests") {
		return;
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { role: true },
	});

	if (!user || user.role !== "ADMIN") {
		throw new Error("Unauthorized");
	}
}

export async function deleteStorageImageServerOnly({
	path,
	scope,
}: {
	path: string;
	scope: StorageScope;
}) {
	assertStoragePathMatchesScope(path, scope);
	await deleteImageFromStorage(path);
	return { success: true };
}
