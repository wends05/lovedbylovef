import z from "zod";

export const PaginationSchema = z.object({
	cursor: z.string().optional(),
	pageSize: z.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
