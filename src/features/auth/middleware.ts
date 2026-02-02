import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw redirect({ to: "/signin" });
	}
	return await next();
});

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (!session) {
		throw redirect({ to: "/signin" });
	}

	console.log("Retrieving session:", session);
	// Check if user has admin role
	const userRole = session.user.role;

	console.log("User role:", userRole);

	if (userRole !== "ADMIN") {
		throw redirect({ to: "/dashboard" });
	}

	return await next();
});

export const userMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (!session) {
		throw redirect({ to: "/signin" });
	}

	console.log("Retrieving session:", session);
	// Check if user has admin role
	const userRole = session.user.role;

	console.log("User role:", userRole);

	if (userRole === "ADMIN") {
		throw redirect({ to: "/admin/dashboard" });
	}

	return await next();
});
