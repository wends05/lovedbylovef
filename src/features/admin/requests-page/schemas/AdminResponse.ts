import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";

export const AdminResponseSchema = z.object({
	response: z.string().optional(),
	action: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]).optional(),
});

export type AdminResponseFormData = z.infer<typeof AdminResponseSchema>;
