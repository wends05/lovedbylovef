import { queryOptions } from "@tanstack/react-query";
import { getChatData } from "./server";

export const chatQueryOptions = {
	getChatData: (orderId: string) =>
		queryOptions({
			queryKey: ["chatData", orderId],
			queryFn: async () => getChatData({ data: { orderId } }),
		}),
};
