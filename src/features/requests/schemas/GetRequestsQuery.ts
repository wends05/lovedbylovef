import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";
import { PaginationSchema } from "@/lib/schemas/PaginationSchema";

export const GetRequestsQuerySchema = PaginationSchema.extend({
	// Filtering
	status: z
		.enum([
			RequestStatus.PENDING,
			RequestStatus.APPROVED,
			RequestStatus.REJECTED,
			RequestStatus.COMPLETED,
			RequestStatus.CANCELLED,
			"ALL",
		])
		.optional()
		.default("ALL"),

	// Searching (debounced on frontend)
	search: z.string().optional(),

	// Sorting
	sortBy: z.enum(["createdAt", "updatedAt", "userName"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),

	// Date range (ISO strings)
	dateFrom: z.string().datetime().optional(),
	dateTo: z.string().datetime().optional(),
});

export type GetRequestsQueryInput = z.infer<typeof GetRequestsQuerySchema>;
