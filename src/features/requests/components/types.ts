import type { RequestStatus } from "@/generated/prisma/enums";

export interface Request {
	id: string;
	title: string;
	description: string;
	status: RequestStatus;
	imageUrl: string | null;
	createdAt: Date;
	adminResponse: string | null;
}
