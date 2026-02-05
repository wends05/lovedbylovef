import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";
import { SignInSchema, SignUpSchema } from "./schemas/standard";

export const signUpServer = createServerFn({ method: "POST" })
	.inputValidator(SignUpSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData, error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				data: {
					name: data.name,
				},
			},
		});

		if (error) {
			throw error;
		}

		const userId = authData.user?.id;
		if (!userId) {
			throw new Error("Failed to create user session");
		}

		const image =
			(authData.user.user_metadata as { avatar_url?: string } | null)
				?.avatar_url ?? null;

		const dbUser = await prisma.user.upsert({
			where: { id: userId },
			create: {
				id: userId,
				email: data.email,
				name: data.name,
				image,
			},
			update: {
				email: data.email,
				name: data.name,
				image,
			},
		});

		return { user: authData.user, role: dbUser.role };
	});

export const signInServer = createServerFn({ method: "POST" })
	.inputValidator(SignInSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData, error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			throw error;
		}

		const userId = authData.user?.id;
		if (!userId) {
			throw new Error("Failed to sign in");
		}

		const name =
			(authData.user.user_metadata as { name?: string } | null)?.name ??
			data.email.split("@")[0];
		const image =
			(authData.user.user_metadata as { avatar_url?: string } | null)
				?.avatar_url ?? null;

		const dbUser = await prisma.user.upsert({
			where: { id: userId },
			create: {
				id: userId,
				email: data.email,
				name,
				image,
			},
			update: {
				email: data.email,
				name,
				image,
			},
		});

		return { user: authData.user, role: dbUser.role };
	});

export const signOutServer = createServerFn({ method: "POST" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
		return { success: true };
	},
);

export const getCurrentUserRole = createServerFn().handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data } = await supabase.auth.getUser();
	if (!data.user?.id) {
		return { role: null };
	}
	const user = await prisma.user.findUnique({
		where: { id: data.user.id },
		select: { role: true },
	});
	return { role: user?.role ?? null };
});
