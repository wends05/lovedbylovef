import z from "zod";

export const InitiateOrderSchema = z.object({
	requestId: z.string().cuid(),
});
