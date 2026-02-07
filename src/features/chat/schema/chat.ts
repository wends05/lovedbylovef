import z from "zod";

export const ChatMessagePayloadSchema = z.object({
	content: z.string(),
});
