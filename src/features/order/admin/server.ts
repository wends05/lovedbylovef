import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/auth/middleware";
import { prisma } from "@/lib/prisma-client";
import { InitiateOrderSchema } from "./schemas/standard";

export const initiateOrder = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(InitiateOrderSchema)
	.handler(async ({ data }) => {
		const request = await prisma.request.findUnique({
			where: { id: data.requestId },
		});

		if (!request) {
			throw new Error("Request not found");
		}

		if (request.status !== "APPROVED") {
			throw new Error("Request must be approved before creating an order");
		}

		const existingOrder = await prisma.order.findUnique({
			where: { requestId: request.id },
		});

		if (existingOrder) {
			throw new Error("Order already exists for this request");
		}

		const result = await prisma.$transaction(async (tx) => {
			const order = await tx.order.create({
				data: {
					requestorId: request.userId,
					requestId: request.id,
					status: "PENDING",
					totalPrice: null,
				},
			});

			const orderChat = await tx.orderChat.create({
				data: {
					orderId: order.id,
					userId: request.userId,
				},
			});

			return { order, orderChat };
		});

		return result;
	});
