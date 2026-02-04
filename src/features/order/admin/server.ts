import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/auth/middleware";
import { prisma } from "@/lib/prisma-client";
import { InitiateOrderSchema } from "./schemas/standard";

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
