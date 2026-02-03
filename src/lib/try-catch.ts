export type TryCatchResult<T> = {
	data: T | null;
	error: string | null;
	success: boolean;
};

export type TryCatchOptions<T> = {
	onSuccess?: (data: T) => T | undefined;
	onError?: (error: string) => string | undefined;
};

export async function tryCatch<T>(
	fnOrPromise: (() => Promise<T> | T) | Promise<T>,
	options?: TryCatchOptions<Awaited<T>>,
): Promise<TryCatchResult<Awaited<T>>> {
	try {
		const result =
			typeof fnOrPromise === "function"
				? await fnOrPromise()
				: await fnOrPromise;

		if (options?.onSuccess) {
			const modifiedData = options.onSuccess(result);
			return {
				data: modifiedData !== undefined ? modifiedData : result,
				error: null,
				success: true,
			};
		}

		return {
			data: result,
			error: null,
			success: true,
		};
	} catch (err) {
		let errorMessage: string;

		if (err instanceof Error) {
			errorMessage = err.message;
		} else if (typeof err === "string") {
			errorMessage = err;
		} else if (
			err !== null &&
			typeof err === "object" &&
			"message" in err &&
			typeof err.message === "string"
		) {
			errorMessage = err.message;
		} else if (err === null || err === undefined) {
			errorMessage = "Unknown error";
		} else {
			try {
				errorMessage = JSON.stringify(err);
			} catch {
				errorMessage = String(err);
			}
		}

		let finalError = errorMessage;
		if (options?.onError) {
			const modifiedError = options.onError(errorMessage);
			if (modifiedError !== undefined) {
				finalError = modifiedError;
			}
		}

		return {
			data: null,
			error: finalError,
			success: false,
		};
	}
}
