import z from "zod";
import { OrderStatus } from "@/generated/prisma/enums";

export const UpdateOrderLifecycleSchema = z
	.object({
		orderId: z.string().min(1),
		nextStatus: z.enum([OrderStatus.PROCESSING, OrderStatus.DELIVERED]),
		totalPrice: z.number().positive().optional(),
	})
	.superRefine((data, ctx) => {
		if (
			data.nextStatus === OrderStatus.PROCESSING &&
			typeof data.totalPrice !== "number"
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["totalPrice"],
				message: "Total price is required before processing an order.",
			});
		}
	});

export type UpdateOrderLifecycleInput = z.infer<
	typeof UpdateOrderLifecycleSchema
>;
