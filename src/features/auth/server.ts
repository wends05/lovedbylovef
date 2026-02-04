import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { SignInSchema, SignUpSchema } from "./schemas/standard";

export const signUpServer = createServerFn({ method: "POST" })
	.inputValidator(SignUpSchema)
	.handler(async ({ data }) => {
		const res = await auth.api.signUpEmail({
			body: data,
		});

		return res;
	});

export const signInServer = createServerFn({ method: "POST" })
	.inputValidator(SignInSchema)
	.handler(async ({ data }) => {
		const res = await auth.api.signInEmail({
			body: data,
		});

		return res;
	});

export const signOutServer = createServerFn({ method: "POST" }).handler(
	async () => {
		const res = await auth.api.signOut();

		return res;
	},
);
