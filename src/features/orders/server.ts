import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { OrderStatus, RequestStatus } from "@/generated/prisma/enums";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";
import { UpdateOrderLifecycleSchema } from "./schemas/UpdateOrderLifecycle";

export const getOrderById = createServerFn()
	.middleware([authMiddleware])
	.inputValidator((input: { id: string }) => input)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const viewer = await prisma.user.findUnique({
			where: { id: authData.user.id },
			select: { id: true, role: true },
		});

		if (!viewer) {
			throw new Error("Unauthorized");
		}

		const order = await prisma.order.findUnique({
			where: { id: data.id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				request: {
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
					},
				},
			},
		});

		if (!order) {
			throw new Error("Order not found.");
		}

		const isAdmin = viewer.role === "ADMIN";
		const isOwner = order.requestorId === viewer.id;

		if (!isAdmin && !isOwner) {
			throw new Error("Forbidden");
		}

		return {
			...order,
			viewerRole: viewer.role,
			isAdmin,
			isOwner,
		};
	});

export const updateOrderLifecycle = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateOrderLifecycleSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const viewer = await prisma.user.findUnique({
			where: { id: authData.user.id },
			select: { id: true, role: true },
		});

		if (!viewer) {
			throw new Error("Unauthorized");
		}

		const order = await prisma.order.findUnique({
			where: { id: data.orderId },
			select: {
				id: true,
				requestId: true,
				requestorId: true,
				status: true,
				totalPrice: true,
			},
		});

		if (!order) {
			throw new Error("Order not found.");
		}

		if (data.nextStatus === OrderStatus.PROCESSING) {
			if (viewer.role !== "ADMIN") {
				throw new Error("Only admins can mark pending orders as processing.");
			}

			if (order.status !== OrderStatus.PENDING) {
				throw new Error("Invalid order status transition.");
			}

			if (typeof data.totalPrice !== "number" || data.totalPrice <= 0) {
				throw new Error(
					"Total price is required before processing an order.",
				);
			}

			const updatedOrder = await prisma.order.update({
				where: { id: order.id },
				data: {
					status: OrderStatus.PROCESSING,
					totalPrice: data.totalPrice,
				},
				select: {
					id: true,
					requestId: true,
					status: true,
					totalPrice: true,
				},
			});

			return {
				orderId: updatedOrder.id,
				requestId: updatedOrder.requestId,
				previousStatus: order.status,
				status: updatedOrder.status,
				totalPrice: updatedOrder.totalPrice,
			};
		}

		if (order.status !== OrderStatus.PROCESSING) {
			throw new Error("Invalid order status transition.");
		}

		const canMarkDelivered =
			viewer.role === "ADMIN" || viewer.id === order.requestorId;
		if (!canMarkDelivered) {
			throw new Error(
				"Only admins or the order owner can mark processing orders as delivered.",
			);
		}

		const updatedOrder = await prisma.$transaction(async (tx) => {
			const deliveredOrder = await tx.order.update({
				where: { id: order.id },
				data: { status: OrderStatus.DELIVERED },
				select: {
					id: true,
					requestId: true,
					status: true,
					totalPrice: true,
				},
			});

			await tx.request.update({
				where: { id: order.requestId },
				data: { status: RequestStatus.COMPLETED },
			});

			return deliveredOrder;
		});

		return {
			orderId: updatedOrder.id,
			requestId: updatedOrder.requestId,
			previousStatus: order.status,
			status: updatedOrder.status,
			totalPrice: updatedOrder.totalPrice,
		};
	});
