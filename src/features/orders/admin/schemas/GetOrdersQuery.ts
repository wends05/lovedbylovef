import z from "zod";
import { OrderStatus } from "@/generated/prisma/enums";
import { PaginationSchema } from "@/lib/schemas/PaginationSchema";

export const GetOrdersQuerySchema = PaginationSchema.extend({
	status: z
		.enum([
			OrderStatus.PENDING,
			OrderStatus.PROCESSING,
			OrderStatus.DELIVERED,
			OrderStatus.CANCELED,
			"ALL",
		])
		.optional()
		.default("ALL"),
});

export type GetOrdersQueryInput = z.infer<typeof GetOrdersQuerySchema>;
