import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/auth/middleware";
import { prisma } from "@/lib/prisma-client";
import { GetOrdersQuerySchema } from "./schemas/GetOrdersQuery";
import { InitiateOrderSchema } from "./schemas/InitiateOrder";

export const getAllOrders = createServerFn()
	.middleware([adminMiddleware])
	.inputValidator(GetOrdersQuerySchema)
	.handler(async ({ data }) => {
		const pageSize = data.pageSize;
		const orders = await prisma.order.findMany({
			orderBy: { createdAt: "desc" },
			...(data.status && data.status !== "ALL"
				? { where: { status: data.status } }
				: {}),
			take: pageSize + 1,
			...(data.cursor
				? {
						skip: 1,
						cursor: { id: data.cursor },
					}
				: {}),
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		const hasMore = orders.length > pageSize;
		const items = hasMore ? orders.slice(0, pageSize) : orders;
		const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

		return {
			items,
			nextCursor,
			hasMore,
		};
	});

export const initiateOrder = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(InitiateOrderSchema)
	.handler(async ({ data }) => {
		const result = await prisma.$transaction(async (tx) => {
			const approvedRequest = await tx.request.update({
				where: { id: data.requestId, status: "PENDING" },
				data: { status: "APPROVED", approvedAt: new Date() },
			});

			const order = await tx.order.create({
				data: {
					requestorId: approvedRequest.userId,
					requestId: approvedRequest.id,
					status: "PENDING",
					totalPrice: null,
				},
			});

			const orderChat = await tx.orderChat.create({
				data: {
					orderId: order.id,
					userId: approvedRequest.userId,
				},
			});

			return { approvedRequest, order, orderChat };
		});

		return result;
	});
