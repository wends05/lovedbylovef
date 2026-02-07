import z from "zod";
import { PaginationSchema } from "@/lib/schemas/PaginationSchema";

export const GetChatDataSchema = z.object({
	orderId: z.string(),
});
export const GetChatMessagesSchema = z.object({
	orderChatId: z.string(),
});

export const GetChatMessagesPageSchema = PaginationSchema.extend({
	orderChatId: z.string(),
});

export const SendMessageSchema = z.object({
	orderChatId: z.string(),
	content: z.string().min(1, "Message content cannot be empty"),
});
