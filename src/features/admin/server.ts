import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma-client";
import { adminMiddleware } from "../auth/middleware";

// Admin Dashboard Data
export const getAdminDashboardData = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const [pendingOrders, totalOrders, totalUsers, totalRevenue] =
			await prisma.$transaction([
				prisma.order.count({
					where: { status: "PENDING" },
				}),
				prisma.order.count(),
				prisma.user.count({
					where: {
						role: "USER",
					},
				}),
				prisma.order.aggregate({
					_sum: {
						totalPrice: true,
					},
					where: {
						status: "DELIVERED",
					},
				}),
			]);

		return {
			pendingOrders,
			totalOrders,
			totalUsers,
			totalRevenue: totalRevenue._sum.totalPrice ?? 0,
		};
	});
