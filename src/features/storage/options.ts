import { mutationOptions } from "@tanstack/react-query";
import { deleteStorageImage } from "./server";

export const storageMutationOptions = {
	deleteStorageImage: mutationOptions({
		mutationKey: ["storage", "deleteImage"],
		mutationFn: deleteStorageImage,
	}),
};
