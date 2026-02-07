import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const supabase = getSupabaseServerClient();
	const { data } = await supabase.auth.getUser();
	if (!data.user) {
		throw redirect({ to: "/signin" });
	}
	return await next();
});

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
	const supabase = getSupabaseServerClient();
	const { data } = await supabase.auth.getUser();

	if (!data.user) {
		throw redirect({ to: "/signin" });
	}

	const user = await prisma.user.findUnique({
		where: { id: data.user.id },
		select: { role: true },
	});

	if (!user) {
		throw redirect({ to: "/signin" });
	}

	if (user.role !== "ADMIN") {
		throw redirect({ to: "/dashboard" });
	}

	return await next();
});

export const nonAdminMiddleware = createMiddleware().server(
	async ({ next }) => {
		const supabase = getSupabaseServerClient();
		const { data } = await supabase.auth.getUser();

		if (!data.user) {
			throw redirect({ to: "/signin" });
		}

		const user = await prisma.user.findUnique({
			where: { id: data.user.id },
			select: { role: true },
		});

		if (!user) {
			throw redirect({ to: "/signin" });
		}

		if (user.role === "ADMIN") {
			throw redirect({ to: "/admin/dashboard" });
		}

		return await next();
	},
);
