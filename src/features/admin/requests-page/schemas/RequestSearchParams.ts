import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";

// Search params schema for URL state
export const RequestSearchParamsSchema = z
	.object({
		status: z
			.enum([
				RequestStatus.APPROVED,
				RequestStatus.REJECTED,
				RequestStatus.COMPLETED,
				RequestStatus.CANCELLED,
			])
			.optional(),
		search: z.string().optional(),
		sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
		sortOrder: z.enum(["asc", "desc"]).optional(),
	})
	.catchall(z.unknown()); // Allow other params to pass through

export type RequestSearchParams = z.infer<typeof RequestSearchParamsSchema>;
