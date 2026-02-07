import { deleteStorageImageServerOnly, type StorageScope } from "./server-only";

export const IMAGE_REPLACEMENT_FAILED_ERROR =
	"Image replacement failed during cleanup. Changes were rolled back.";

type ReplaceImageWithCleanupOrThrowParams<TRecord> = {
	scope: StorageScope;
	previousPath?: string | null;
	nextPath?: string | null;
	applyRecordUpdate: () => Promise<TRecord>;
	rollbackRecordUpdate: () => Promise<unknown>;
	cleanupNewPathOnRollback?: boolean;
};

export async function replaceImageWithCleanupOrThrow<TRecord>({
	scope,
	previousPath,
	nextPath,
	applyRecordUpdate,
	rollbackRecordUpdate,
	cleanupNewPathOnRollback = true,
}: ReplaceImageWithCleanupOrThrowParams<TRecord>) {
	const updatedRecord = await applyRecordUpdate();

	const hasReplacedImage = Boolean(
		previousPath && nextPath && previousPath !== nextPath,
	);

	if (!hasReplacedImage) {
		return { record: updatedRecord, replacedImage: false };
	}

	try {
		await deleteStorageImageServerOnly({
			path: previousPath as string,
			scope,
		});
	} catch (cleanupError) {
		try {
			await rollbackRecordUpdate();
		} catch (rollbackError) {
			console.error("Rollback failed after image cleanup error", {
				scope,
				previousPath,
				nextPath,
				cleanupError,
				rollbackError,
			});
			throw new Error(IMAGE_REPLACEMENT_FAILED_ERROR);
		}

		if (cleanupNewPathOnRollback && nextPath && nextPath !== previousPath) {
			try {
				await deleteStorageImageServerOnly({
					path: nextPath,
					scope,
				});
			} catch (deleteNewPathError) {
				console.error(
					"Failed to clean up newly uploaded replacement image during rollback",
					{
						scope,
						nextPath,
						deleteNewPathError,
					},
				);
			}
		}

		throw new Error(IMAGE_REPLACEMENT_FAILED_ERROR);
	}

	return { record: updatedRecord, replacedImage: true };
}
