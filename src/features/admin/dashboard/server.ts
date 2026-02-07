import { createServerFn } from "@tanstack/react-start";
import { OrderStatus, RequestStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma-client";
import { adminMiddleware } from "../../auth/middleware";
import type { AdminDashboardData } from "./schemas/AdminDashboardData";

const DASHBOARD_RECENT_LIMIT = 5;

// Admin Dashboard Data
export const getAdminDashboardData = createServerFn()
	.middleware([adminMiddleware])
	.handler(async (): Promise<AdminDashboardData> => {
		const [
			pendingOrders,
			processingOrders,
			deliveredOrders,
			canceledOrders,
			totalOrders,
			totalUsers,
			totalRequests,
			pendingRequests,
			totalRevenue,
			recentOrders,
			recentRequests,
		] = await prisma.$transaction([
			prisma.order.count({
				where: { status: OrderStatus.PENDING },
			}),
			prisma.order.count({
				where: { status: OrderStatus.PROCESSING },
			}),
			prisma.order.count({
				where: { status: OrderStatus.DELIVERED },
			}),
			prisma.order.count({
				where: { status: OrderStatus.CANCELED },
			}),
			prisma.order.count(),
			prisma.user.count({
				where: {
					role: "USER",
				},
			}),
			prisma.request.count(),
			prisma.request.count({
				where: {
					status: RequestStatus.PENDING,
				},
			}),
			prisma.order.aggregate({
				_sum: {
					totalPrice: true,
				},
				where: {
					status: OrderStatus.DELIVERED,
				},
			}),
			prisma.order.findMany({
				select: {
					id: true,
					status: true,
					totalPrice: true,
					createdAt: true,
					requestId: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: DASHBOARD_RECENT_LIMIT,
			}),
			prisma.request.findMany({
				select: {
					id: true,
					title: true,
					status: true,
					createdAt: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: DASHBOARD_RECENT_LIMIT,
			}),
		]);

		return {
			kpis: {
				pendingOrders,
				processingOrders,
				deliveredOrders,
				canceledOrders,
				totalOrders,
				totalUsers,
				totalRequests,
				pendingRequests,
				totalRevenueDelivered: totalRevenue._sum.totalPrice ?? 0,
			},
			recentOrders,
			recentRequests,
		};
	});
