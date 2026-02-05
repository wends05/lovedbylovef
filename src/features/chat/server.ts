import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma-client";
import { authMiddleware } from "../auth/middleware";
import { GetChatDataSchema } from "./schema/server";

export const getChatData = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(GetChatDataSchema)
	.handler(async ({ data }) => {
		const chatData = await prisma.orderChat.findUnique({
			where: {
				orderId: data.orderId,
			},
			include: {
				order: {
					select: {
						status: true,
					},
				},
				user: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});
		return chatData;
	});
