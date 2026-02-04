import { mutationOptions } from "@tanstack/react-query";
import { signInServer, signOutServer, signUpServer } from "./server";

export const authOptions = {
	signInServer: mutationOptions({
		mutationKey: ["auth", "signIn"],
		mutationFn: signInServer,
	}),
	signUpServer: mutationOptions({
		mutationKey: ["auth", "signUp"],
		mutationFn: signUpServer,
	}),
	signOutServer: mutationOptions({
		mutationKey: ["auth", "signOut"],
		mutationFn: signOutServer,
	}),
};
