import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { initiateOrder } from "@/features/orders/admin/server";
import { RequestStatus } from "@/generated/prisma/enums";
import type {
	RequestUpdateInput,
	RequestWhereInput,
} from "@/generated/prisma/models";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { deleteImageFromStorage } from "@/integrations/supabase/storage-server";
import { prisma } from "@/lib/prisma-client";
import { tryCatch } from "@/lib/try-catch";
import { adminMiddleware } from "../auth/middleware";
import { GetRequestsQuerySchema } from "./schemas/GetRequestsQuery";
import {
	RequestFormSubmission,
	UpdateRequestSubmissionSchema,
} from "./schemas/RequestForm";
import { UpdateRequestStatusSchema } from "./schemas/UpdateRequestStatus";

interface GetUserRequestsInput {
	status?: RequestStatus | "ALL";
	cursor?: string;
	pageSize?: number;
}

export const getUserRequests = createServerFn()
	.inputValidator((input: GetUserRequestsInput) => input)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const pageSize = data.pageSize ?? 10;

		const requests = await prisma.request.findMany({
			where: {
				userId: authData.user.id,
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
			include: {
				order: {
					select: {
						id: true,
					},
				},
			},
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

export const getRequestById = createServerFn()
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const request = await prisma.request.findFirst({
			where: {
				id: data.id,
				userId: authData.user.id,
			},
		});

		if (!request) {
			throw new Error("Request not found");
		}

		return request;
	});

export const cancelRequest = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const request = await prisma.request.findFirst({
			where: {
				id: data.id,
				userId: authData.user.id,
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

		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		console.log("Authenticated user:", authData.user);
		if (!authData.user) {
			throw new Error("Unauthorized");
		}

		console.log("Creating request in database with data:", data);
		const request = await tryCatch(
			prisma.request.create({
				data: {
					...data,
					userId: authData.user.id,
				},
			}),
		);

		if (request.error) {
			console.error("Error creating request:", request.error);
		}

		console.log("Request created:", request);
		return request.data;
	});

export const updateUserRequest = createServerFn({ method: "POST" })
	.inputValidator(UpdateRequestSubmissionSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const existingRequest = await prisma.request.findFirst({
			where: {
				id: data.id,
				userId: authData.user.id,
				status: "PENDING",
			},
		});

		if (!existingRequest) {
			throw new Error(
				"Request not found or cannot be edited (only pending requests can be edited)",
			);
		}

		const updateData: RequestUpdateInput = {
			title: data.title,
			description: data.description,
			...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
			...(data.imageKey !== undefined ? { imageKey: data.imageKey } : {}),
		};

		const updatedRequest = await prisma.request.update({
			where: { id: data.id },
			data: updateData,
		});

		return updatedRequest;
	});

export const deleteImage = createServerFn({ method: "POST" })
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		console.log("image to be deleted:", data);
		await deleteImageFromStorage(data);
		return { success: true };
	});

export const getAllRequests = createServerFn()
	.middleware([adminMiddleware])
	.inputValidator(GetRequestsQuerySchema)
	.handler(async ({ data }) => {
		const pageSize = data.pageSize;

		// Build where clause
		const where: RequestWhereInput = {};

		// Status filter
		if (data.status && data.status !== "ALL") {
			where.status = data.status;
		}

		// Search filter (searches title, description, user name, user email)
		if (data.search && data.search.trim() !== "") {
			where.OR = [
				{ title: { contains: data.search, mode: "insensitive" } },
				{ description: { contains: data.search, mode: "insensitive" } },
				{ user: { name: { contains: data.search, mode: "insensitive" } } },
				{ user: { email: { contains: data.search, mode: "insensitive" } } },
			];
		}

		// Build orderBy clause
		let orderBy = {};
		if (data.sortBy === "userName") {
			orderBy = { user: { name: data.sortOrder } };
		} else {
			orderBy = { [data.sortBy]: data.sortOrder };
		}

		// Fetch requests with pagination
		const requests = await prisma.request.findMany({
			where,
			orderBy,
			take: pageSize + 1, // Fetch one extra to determine if there's more
			...(data.cursor
				? {
						skip: 1,
						cursor: { id: data.cursor },
					}
				: {}),
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

		const hasMore = requests.length > pageSize;
		const items = hasMore ? requests.slice(0, pageSize) : requests;
		const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

		return {
			items,
			nextCursor,
			hasMore,
		};
	});

export const updateRequestStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(UpdateRequestStatusSchema)
	.handler(async ({ data }) => {
		// check if the request exists and if the request is to be approved.

		if (data.status === RequestStatus.APPROVED) {
			// Handle initiating a conversation for the admin.
			const {
				data: order,
				error,
				success,
			} = await tryCatch(
				initiateOrder({ data: { requestId: data.requestId } }),
			);

			if (!success) {
				throw new Error(
					error || "Failed to initiate order for approved request",
				);
			}

			return order;
		}

		const updateData: RequestUpdateInput = {
			status: data.status,
			adminResponse: data.adminResponse || null,
			approvedAt: new Date(),
		};

		const updatedRequest = await prisma.request.update({
			where: { id: data.requestId },
			data: updateData,
		});

		return updatedRequest;
	});
