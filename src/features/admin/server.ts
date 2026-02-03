import { createServerFn } from "@tanstack/react-start";
import type { Category } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client";
import { adminMiddleware } from "../auth/middleware";

// Admin Dashboard Data
export const getAdminDashboardData = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const [pendingOrders, totalOrders, totalUsers, totalRevenue] =
			await prisma.$transaction([
				prisma.order.count({
					where: { status: "PENDING" },
				}),
				prisma.order.count(),
				prisma.user.count({
					where: {
						role: "USER",
					},
				}),
				prisma.order.aggregate({
					_sum: {
						totalPrice: true,
					},
					where: {
						status: "DELIVERED",
					},
				}),
			]);

		return {
			pendingOrders,
			totalOrders,
			totalUsers,
			totalRevenue: totalRevenue._sum.totalPrice ?? 0,
		};
	});

// Get all crochets for admin (including hidden)
export const getAllCrochetsAdmin = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const crochets = await prisma.crochet.findMany({
			orderBy: { createdAt: "desc" },
		});
		return crochets;
	});

// Get all crochets (including hidden ones for admin)
export const getAllCrochets = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const crochets = await prisma.crochet.findMany({
			orderBy: { createdAt: "desc" },
		});
		return crochets;
	});

// Create new crochet
interface CreateCrochetInput {
	name: string;
	description: string;
	category: Category;
	price: number;
	imageURL: string;
	isVisible?: boolean;
}

export const createCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator((input: CreateCrochetInput) => input)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.create({
			data: {
				name: data.name,
				description: data.description,
				category: data.category,
				price: data.price,
				imageURL: data.imageURL,
				isVisible: data.isVisible ?? true,
			},
		});
		return crochet;
	});

// Update crochet
interface UpdateCrochetInput {
	id: string;
	name?: string;
	description?: string;
	category?: Category;
	price?: number;
	imageURL?: string;
	isVisible?: boolean;
}

export const updateCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator((input: UpdateCrochetInput) => input)
	.handler(async ({ data }) => {
		const { id, ...updateData } = data;
		const crochet = await prisma.crochet.update({
			where: { id },
			data: updateData,
		});
		return crochet;
	});

// Delete crochet
interface DeleteCrochetInput {
	id: string;
}

export const deleteCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator((input: DeleteCrochetInput) => input)
	.handler(async ({ data }) => {
		await prisma.crochet.delete({
			where: { id: data.id },
		});
		return { success: true };
	});

// Toggle crochet visibility
interface ToggleCrochetVisibilityInput {
	id: string;
	isVisible: boolean;
}

export const toggleCrochetVisibility = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator((input: ToggleCrochetVisibilityInput) => input)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.update({
			where: { id: data.id },
			data: { isVisible: data.isVisible },
		});
		return crochet;
	});
