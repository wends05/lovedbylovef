import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";
import { authMiddleware } from "../auth/middleware";
import {
	GetChatDataSchema,
	GetChatMessagesPageSchema,
	GetChatMessagesSchema,
	SendMessageSchema,
} from "./schema/server";

const FORBIDDEN_ERROR_MESSAGE = "Forbidden";

type ChatAccessContext = {
	orderChatId: string;
	orderId: string;
	ownerId: string;
	requestorId: string;
};

const isForbidden = ({
	currentUserId,
	currentUserRole,
	accessContext,
}: {
	currentUserId: string;
	currentUserRole: "ADMIN" | "USER" | null;
	accessContext: ChatAccessContext;
}) => {
	if (currentUserRole === "ADMIN") {
		return false;
	}

	return (
		currentUserId !== accessContext.requestorId &&
		currentUserId !== accessContext.ownerId
	);
};

const getCurrentUserAuthContext = createServerOnlyFn(async () => {
	const supabase = getSupabaseServerClient();
	const { data } = await supabase.auth.getUser();

	if (!data.user?.id) {
		throw new Error("User not authenticated");
	}

	const dbUser = await prisma.user.findUnique({
		where: { id: data.user.id },
		select: { role: true },
	});

	return {
		userId: data.user.id,
		role: dbUser?.role ?? null,
	};
});

const getChatAccessContextByOrderId = createServerOnlyFn(
	async (orderId: string) => {
		const orderChat = await prisma.orderChat.findUnique({
			where: { orderId },
			select: {
				id: true,
				orderId: true,
				userId: true,
				order: {
					select: {
						requestorId: true,
					},
				},
			},
		});

		if (!orderChat) {
			return null;
		}

		return {
			orderChatId: orderChat.id,
			orderId: orderChat.orderId,
			ownerId: orderChat.userId,
			requestorId: orderChat.order.requestorId,
		} satisfies ChatAccessContext;
	},
);

const getChatAccessContextByChatId = createServerOnlyFn(
	async (orderChatId: string) => {
		const orderChat = await prisma.orderChat.findUnique({
			where: { id: orderChatId },
			select: {
				id: true,
				orderId: true,
				userId: true,
				order: {
					select: {
						requestorId: true,
					},
				},
			},
		});

		if (!orderChat) {
			return null;
		}

		return {
			orderChatId: orderChat.id,
			orderId: orderChat.orderId,
			ownerId: orderChat.userId,
			requestorId: orderChat.order.requestorId,
		} satisfies ChatAccessContext;
	},
);

export const getChatData = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(GetChatDataSchema)
	.handler(
		createServerOnlyFn(async ({ data }) => {
			const [accessContext, authContext] = await Promise.all([
				getChatAccessContextByOrderId(data.orderId),
				getCurrentUserAuthContext(),
			]);

			if (!accessContext) {
				return null;
			}

			if (
				isForbidden({
					currentUserId: authContext.userId,
					currentUserRole: authContext.role,
					accessContext,
				})
			) {
				throw new Error(FORBIDDEN_ERROR_MESSAGE);
			}

			const chatData = await prisma.orderChat.findUnique({
				where: {
					orderId: data.orderId,
				},
				include: {
					order: {
						select: {
							id: true,
							requestorId: true,
							status: true,
							orderChat: {
								select: {
									id: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});
			return chatData;
		}),
	);

export const getChatMessages = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(GetChatMessagesSchema)
	.handler(
		createServerOnlyFn(async ({ data }) => {
			const [accessContext, authContext] = await Promise.all([
				getChatAccessContextByChatId(data.orderChatId),
				getCurrentUserAuthContext(),
			]);

			if (!accessContext) {
				throw new Error("Chat not found");
			}

			if (
				isForbidden({
					currentUserId: authContext.userId,
					currentUserRole: authContext.role,
					accessContext,
				})
			) {
				throw new Error(FORBIDDEN_ERROR_MESSAGE);
			}

			const messages = await prisma.chatMessage.findMany({
				where: {
					orderChatId: data.orderChatId,
				},
				include: {
					author: {
						select: {
							id: true,
							image: true,
							name: true,
						},
					},
				},
			});

			return messages;
		}),
	);

export const getChatMessagesPage = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(GetChatMessagesPageSchema)
	.handler(
		createServerOnlyFn(async ({ data }) => {
			const [accessContext, authContext] = await Promise.all([
				getChatAccessContextByChatId(data.orderChatId),
				getCurrentUserAuthContext(),
			]);

			if (!accessContext) {
				throw new Error("Chat not found");
			}

			if (
				isForbidden({
					currentUserId: authContext.userId,
					currentUserRole: authContext.role,
					accessContext,
				})
			) {
				throw new Error(FORBIDDEN_ERROR_MESSAGE);
			}

			const pageSize = data.pageSize;

			const messages = await prisma.chatMessage.findMany({
				where: {
					orderChatId: data.orderChatId,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: pageSize + 1,
				...(data.cursor
					? {
							cursor: { id: data.cursor },
							skip: 1,
						}
					: {}),
				include: {
					author: {
						select: {
							id: true,
							image: true,
							name: true,
						},
					},
				},
			});

			const hasMore = messages.length > pageSize;
			const items = hasMore ? messages.slice(0, pageSize) : messages;
			const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

			return {
				items,
				nextCursor,
			};
		}),
	);

export const sendMessage = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(SendMessageSchema)
	.handler(
		createServerOnlyFn(async ({ data }) => {
			const [accessContext, authContext] = await Promise.all([
				getChatAccessContextByChatId(data.orderChatId),
				getCurrentUserAuthContext(),
			]);

			if (!accessContext) {
				throw new Error("Chat not found");
			}

			if (
				isForbidden({
					currentUserId: authContext.userId,
					currentUserRole: authContext.role,
					accessContext,
				})
			) {
				throw new Error(FORBIDDEN_ERROR_MESSAGE);
			}

			console.log(
				"Creating message with data:",
				data,
				"for user:",
				authContext.userId,
			);

			const message = await prisma.chatMessage.create({
				data: {
					content: data.content,
					orderChatId: data.orderChatId,
					authorId: authContext.userId,
				},
			});
			return message;
		}),
	);
