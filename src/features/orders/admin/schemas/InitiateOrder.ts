import z from "zod";

export const InitiateOrderSchema = z.object({
	requestId: z.cuid(),
	adminResponse: z.string().optional(),
});
