import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { OrderStatus, RequestStatus } from "@/generated/prisma/enums";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";
import type { UserDashboardData } from "./schemas/DashboardData";

const DASHBOARD_RECENT_LIMIT = 5;

export const getDashboardData = createServerFn()
	.middleware([authMiddleware])
	.handler(async (): Promise<UserDashboardData> => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const userId = authData.user.id;
		const [
			totalOrders,
			pendingOrders,
			processingOrders,
			deliveredOrders,
			canceledOrders,
			totalRequests,
			pendingRequests,
			recentOrders,
			recentRequests,
		] = await prisma.$transaction([
			prisma.order.count({
				where: { requestorId: userId },
			}),
			prisma.order.count({
				where: {
					requestorId: userId,
					status: OrderStatus.PENDING,
				},
			}),
			prisma.order.count({
				where: {
					requestorId: userId,
					status: OrderStatus.PROCESSING,
				},
			}),
			prisma.order.count({
				where: {
					requestorId: userId,
					status: OrderStatus.DELIVERED,
				},
			}),
			prisma.order.count({
				where: {
					requestorId: userId,
					status: OrderStatus.CANCELED,
				},
			}),
			prisma.request.count({
				where: { userId },
			}),
			prisma.request.count({
				where: {
					userId,
					status: RequestStatus.PENDING,
				},
			}),
			prisma.order.findMany({
				where: { requestorId: userId },
				select: {
					id: true,
					status: true,
					totalPrice: true,
					createdAt: true,
					requestId: true,
				},
				orderBy: { createdAt: "desc" },
				take: DASHBOARD_RECENT_LIMIT,
			}),
			prisma.request.findMany({
				where: { userId },
				select: {
					id: true,
					title: true,
					status: true,
					createdAt: true,
				},
				orderBy: { createdAt: "desc" },
				take: DASHBOARD_RECENT_LIMIT,
			}),
		]);

		return {
			kpis: {
				totalOrders,
				pendingOrders,
				processingOrders,
				deliveredOrders,
				canceledOrders,
				totalRequests,
				pendingRequests,
			},
			recentOrders,
			recentRequests,
		};
	});
