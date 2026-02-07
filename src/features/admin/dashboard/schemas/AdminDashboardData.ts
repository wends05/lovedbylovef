import z from "zod";
import { OrderStatus, RequestStatus } from "@/generated/prisma/enums";

export const AdminDashboardKpisSchema = z.object({
	pendingOrders: z.number(),
	processingOrders: z.number(),
	deliveredOrders: z.number(),
	canceledOrders: z.number(),
	totalOrders: z.number(),
	totalUsers: z.number(),
	totalRequests: z.number(),
	pendingRequests: z.number(),
	totalRevenueDelivered: z.number(),
});

export const AdminRecentOrderSchema = z.object({
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
	user: z.object({
		id: z.string(),
		name: z.string().nullable(),
		email: z.string(),
	}),
});

export const AdminRecentRequestSchema = z.object({
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
	user: z.object({
		id: z.string(),
		name: z.string().nullable(),
		email: z.string(),
	}),
});

export const AdminDashboardDataSchema = z.object({
	kpis: AdminDashboardKpisSchema,
	recentOrders: z.array(AdminRecentOrderSchema),
	recentRequests: z.array(AdminRecentRequestSchema),
});

export type AdminDashboardData = z.infer<typeof AdminDashboardDataSchema>;
