import {
	infiniteQueryOptions,
	mutationOptions,
	queryOptions,
} from "@tanstack/react-query";
import { getChatData, getChatMessagesPage, sendMessage } from "./server";

export const CHAT_MESSAGES_PAGE_SIZE = 30;

export const chatQueryOptions = {
	getChatData: (orderId: string) =>
		queryOptions({
			queryKey: ["chatData", orderId],
			queryFn: async () => getChatData({ data: { orderId } }),
		}),
	getChatMessagesInfinite: (orderChatId: string) =>
		infiniteQueryOptions({
			queryKey: ["chatMessages", orderChatId],
			queryFn: async ({ pageParam }) =>
				getChatMessagesPage({
					data: {
						orderChatId,
						cursor: pageParam,
						pageSize: CHAT_MESSAGES_PAGE_SIZE,
					},
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),
};

export const chatMutationOptions = {
	sendMessage: mutationOptions({
		mutationFn: async ({
			orderChatId,
			content,
		}: {
			orderChatId: string;
			content: string;
		}) => sendMessage({ data: { orderChatId, content } }),
	}),
};
