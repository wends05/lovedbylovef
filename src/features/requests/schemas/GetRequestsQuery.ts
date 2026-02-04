import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";

export const GetRequestsQuerySchema = z.object({
	// Pagination
	cursor: z.string().optional(),
	pageSize: z.number().min(1).max(100).default(20),

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
