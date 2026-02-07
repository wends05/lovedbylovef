import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";

export const UpdateRequestStatusSchema = z.object({
	requestId: z.string(),
	status: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]),
	adminResponse: z.string().optional(),
});

export type UpdateRequestStatusInput = z.infer<
	typeof UpdateRequestStatusSchema
>;
