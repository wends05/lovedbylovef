import z from "zod";
import { OrderStatus, RequestStatus } from "@/generated/prisma/enums";

export const UserDashboardKpisSchema = z.object({
	totalOrders: z.number(),
	pendingOrders: z.number(),
	processingOrders: z.number(),
	deliveredOrders: z.number(),
	canceledOrders: z.number(),
	totalRequests: z.number(),
	pendingRequests: z.number(),
});

export const UserRecentOrderSchema = z.object({
	id: z.string(),
	status: z.enum([
		OrderStatus.PENDING,
		OrderStatus.PROCESSING,
		OrderStatus.DELIVERED,
		OrderStatus.CANCELED,
	]),
	totalPrice: z.number().nullable(),
	createdAt: z.date(),
	requestId: z.string(),
});

export const UserRecentRequestSchema = z.object({
	id: z.string(),
	title: z.string(),
	status: z.enum([
		RequestStatus.PENDING,
		RequestStatus.APPROVED,
		RequestStatus.REJECTED,
		RequestStatus.COMPLETED,
		RequestStatus.CANCELLED,
	]),
	createdAt: z.date(),
});

export const UserDashboardDataSchema = z.object({
	kpis: UserDashboardKpisSchema,
	recentOrders: z.array(UserRecentOrderSchema),
	recentRequests: z.array(UserRecentRequestSchema),
});

export type UserDashboardData = z.infer<typeof UserDashboardDataSchema>;
