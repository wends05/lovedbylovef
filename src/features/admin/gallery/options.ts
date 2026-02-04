import { mutationOptions } from "@tanstack/react-query";
import {
	createCrochet,
	deleteCrochet,
	deleteCrochetImage,
	toggleCrochetVisibility,
	updateCrochet,
} from "./server";

export const galleryMutationOptions = {
	createCrochet: mutationOptions({
		mutationKey: ["adminCrochets", "create"],
		mutationFn: createCrochet,
	}),
	updateCrochet: mutationOptions({
		mutationKey: ["adminCrochets", "update"],
		mutationFn: updateCrochet,
	}),
	deleteCrochet: mutationOptions({
		mutationKey: ["adminCrochets", "delete"],
		mutationFn: deleteCrochet,
	}),
	deleteCrochetImage: mutationOptions({
		mutationKey: ["adminCrochets", "deleteImage"],
		mutationFn: deleteCrochetImage,
	}),
	toggleCrochetVisibility: mutationOptions({
		mutationKey: ["adminCrochets", "toggleVisibility"],
		mutationFn: toggleCrochetVisibility,
	}),
};
