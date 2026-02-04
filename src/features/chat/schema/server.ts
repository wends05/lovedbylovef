import z from "zod";

export const GetChatDataSchema = z.object({
  orderId: z.uuid(),
})
