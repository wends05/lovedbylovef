import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";

export const getDashboardData = createServerFn().handler(async () => {
	const headers = await getRequestHeaders();
	const session = await auth.api.getSession({
		headers,
	});
	const dashboardData = await prisma.$transaction([
		prisma.order.count({
			where: { userId: session?.user?.id },
		}),
		prisma.request.count({
			where: { userId: session?.user?.id },
		}),
	]);

	return {
		totalOrders: dashboardData[0],
		totalRequests: dashboardData[1],
	};
});
