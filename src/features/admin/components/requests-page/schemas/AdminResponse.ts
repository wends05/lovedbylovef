import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";

export const AdminResponseSchema = z.object({
	response: z.string(),
	action: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]),
});

export type AdminResponseFormData = z.infer<typeof AdminResponseSchema>;
