import z from "zod";

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(100),
});

export const SignUpSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(100),
	name: z.string().min(2).max(100),
});
