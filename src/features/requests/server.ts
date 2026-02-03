import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";
import type { RequestUpdateInput } from "@/generated/prisma/models";
import { utapi } from "@/integrations/uploadthing/api";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { tryCatch } from "@/lib/try-catch";
import { adminMiddleware } from "../auth/middleware";
import { RequestFormSubmission } from "./schemas/RequestForm";

interface GetUserRequestsInput {
	status?: RequestStatus | "ALL";
	cursor?: string;
	pageSize?: number;
}

export const getUserRequests = createServerFn({ method: "POST" })
	.inputValidator((input: GetUserRequestsInput) => input)
	.handler(async ({ data }) => {
		const headers = await getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const pageSize = data.pageSize ?? 10;

		const requests = await prisma.request.findMany({
			where: {
				userId: session.user.id,
				...(data.status && data.status !== "ALL"
					? { status: data.status }
					: {}),
			},
			orderBy: { createdAt: "desc" },
			take: pageSize + 1,
			...(data.cursor
				? {
						skip: 1,
						cursor: { id: data.cursor },
					}
				: {}),
		});

		const hasMore = requests.length > pageSize;
		const items = hasMore ? requests.slice(0, pageSize) : requests;
		const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

		return {
			items,
			nextCursor,
			hasMore,
		};
	});

export const getRequestById = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const headers = await getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const request = await prisma.request.findFirst({
			where: {
				id: data.id,
				userId: session.user.id,
			},
		});

		if (!request) {
			throw new Error("Request not found");
		}

		return request;
	});

interface CancelRequestInput {
	id: string;
}

export const cancelRequest = createServerFn({ method: "POST" })
	.inputValidator((input: CancelRequestInput) => input)
	.handler(async ({ data }) => {
		const headers = await getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const request = await prisma.request.findFirst({
			where: {
				id: data.id,
				userId: session.user.id,
				status: "PENDING",
			},
		});

		if (!request) {
			throw new Error(
				"Request not found or cannot be cancelled (only pending requests can be cancelled)",
			);
		}

		const updatedRequest = await prisma.request.update({
			where: { id: data.id },
			data: { status: RequestStatus.CANCELLED },
		});

		return updatedRequest;
	});

export const submitRequest = createServerFn({ method: "POST" })
	.inputValidator(RequestFormSubmission)
	.handler(async ({ data }) => {
		console.log("Submitting request with data:", data);

		const headers = await getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});

		console.log("Authenticated user:", session);
		if (!session) {
			throw new Error("Unauthorized");
		}

		console.log("Creating request in database with data:", data);
		const request = await tryCatch(
			prisma.request.create({
				data: {
					...data,
					userId: session.user.id,
				},
			}),
		);

		if (request.error) {
			console.error("Error creating request:", request.error);
		}

		console.log("Request created:", request);
		return request.data;
	});

export const deleteImage = createServerFn({ method: "POST" })
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		console.log("image to be deleted:", data);
		const res = await utapi.deleteFiles(data);

		return { success: res.success, deletedCount: res.deletedCount };
	});

export const getAllRequests = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const requests = await prisma.request.findMany({
			orderBy: { createdAt: "desc" },
			where: {
				OR: [
					{status: RequestStatus.PENDING},
					{status: RequestStatus.REJECTED},
				]
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});
		return requests;
	});

export const updateRequestStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(
		z.object({
			requestId: z.string(),
			status: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]),
			adminResponse: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const headers = await getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});

		if (!session) {
			throw new Error("Unauthorized");
		}
		const updateData: RequestUpdateInput = {
			status: data.status,
			adminResponse: data.adminResponse || null,
			approvedBy: {
				connect: { id: session.user.id },
			},
			approvedAt: new Date(),
		};

		const updatedRequest = await prisma.request.update({
			where: { id: data.requestId },
			data: updateData,
		});

		return updatedRequest;
	});
