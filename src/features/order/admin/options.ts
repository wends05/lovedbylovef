import { mutationOptions } from "@tanstack/react-query";
import { initiateOrder } from "./server";

export const orderAdminMutationOptions = {
	initiateOrder: mutationOptions({
		mutationKey: ["orders", "initiate"],
		mutationFn: initiateOrder,
	}),
};
