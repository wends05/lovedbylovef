import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { initiateOrder } from "@/features/orders/admin/server";
import { RequestStatus } from "@/generated/prisma/enums";
import type {
	RequestUpdateInput,
	RequestWhereInput,
} from "@/generated/prisma/models";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { getStoragePublicUrl } from "@/integrations/supabase/storage-server";
import { prisma } from "@/lib/prisma-client";
import { tryCatch } from "@/lib/try-catch";
import { adminMiddleware, authMiddleware } from "../auth/middleware";
import { replaceImageWithCleanupOrThrow } from "../storage/replace-image";
import { deleteStorageImageServerOnly } from "../storage/server-only";
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

function withImageUrl<T extends { imagePath: string | null }>(request: T) {
	return {
		...request,
		imageUrl: getStoragePublicUrl(request.imagePath),
	};
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
			items: items.map(withImageUrl),
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

		return withImageUrl(request);
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

export const deleteUserRequest = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
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
				status: { in: [RequestStatus.CANCELLED, RequestStatus.REJECTED] },
			},
		});

		if (!request) {
			throw new Error(
				"Request not found or cannot be deleted (only cancelled or rejected requests can be deleted)",
			);
		}

		if (request.imagePath) {
			const { error } = await tryCatch(
				deleteStorageImageServerOnly({
					path: request.imagePath,
					scope: "requests",
				}),
			);
			if (error) {
				console.error("Failed to delete request image during user delete", {
					requestId: request.id,
					error,
				});
			}
		}

		await prisma.request.delete({
			where: { id: data.id },
		});

		return { success: true };
	});

export const submitRequest = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(RequestFormSubmission)
	.handler(async ({ data }) => {
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

		const previousRequestState = {
			title: existingRequest.title,
			description: existingRequest.description,
			imagePath: existingRequest.imagePath,
		};
		const nextImagePath = data.imagePath ?? existingRequest.imagePath;
		const updateData: RequestUpdateInput = {
			title: data.title,
			description: data.description,
			...(data.imagePath !== undefined ? { imagePath: data.imagePath } : {}),
		};

		const { record, replacedImage } = await replaceImageWithCleanupOrThrow({
			scope: "requests",
			previousPath: existingRequest.imagePath,
			nextPath: nextImagePath,
			applyRecordUpdate: () =>
				prisma.request.update({
					where: { id: data.id },
					data: updateData,
				}),
			rollbackRecordUpdate: () =>
				prisma.request.update({
					where: { id: data.id },
					data: previousRequestState,
				}),
			cleanupNewPathOnRollback: true,
		});

		return {
			request: withImageUrl(record),
			replacedImage,
		};
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
			items: items.map(withImageUrl),
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
				initiateOrder({ data: { requestId: data.requestId, adminResponse: data.adminResponse } }),
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
