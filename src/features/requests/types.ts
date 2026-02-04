import type { RequestStatus } from "@/generated/prisma/enums";

export type AdminRequestItem = {
	id: string;
	title: string;
	description: string;
	status: RequestStatus;
	imageUrl: string | null;
	adminResponse: string | null;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		email: string;
	};
};

export type AdminRequestsPage = {
	items: AdminRequestItem[];
	nextCursor?: string;
	hasMore: boolean;
};
