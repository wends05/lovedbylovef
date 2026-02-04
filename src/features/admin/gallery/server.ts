import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "@/features/auth/middleware";
import { utapi } from "@/integrations/uploadthing/api";
import { prisma } from "@/lib/prisma-client";
import {
	CreateCrochetSchema,
	DeleteCrochetSchema,
	GetCrochetByIdSchema,
	ToggleCrochetVisibilitySchema,
	UpdateCrochetSchema,
} from "./schemas/CrochetSchemas";

// Get all crochets for admin (including hidden)
export const getAllCrochetsAdmin = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const crochets = await prisma.crochet.findMany({
			orderBy: { createdAt: "desc" },
		});
		return crochets;
	});

// Get crochet by ID
export const getCrochetById = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(GetCrochetByIdSchema)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.findUnique({
			where: { id: data.id },
		});
		if (!crochet) {
			throw new Error("Crochet not found");
		}
		return crochet;
	});

// Create new crochet
export const createCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(CreateCrochetSchema)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.create({
			data: {
				name: data.name,
				description: data.description,
				category: data.category,
				price: data.price ?? null,
				imageURL: data.imageURL,
				imageKey: data.imageKey ?? null,
				imageHash: data.imageHash ?? null,
				isVisible: data.isVisible ?? true,
			},
		});
		return crochet;
	});

// Update crochet
export const updateCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(UpdateCrochetSchema)
	.handler(async ({ data }) => {
		const { id, ...updateData } = data;
		const crochet = await prisma.crochet.update({
			where: { id },
			data: updateData,
		});
		return crochet;
	});

export const deleteCrochetImage = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		const res = await utapi.deleteFiles(data);
		return { success: res.success, deletedCount: res.deletedCount };
	});

// Delete crochet (hard delete)
export const deleteCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(DeleteCrochetSchema)
	.handler(async ({ data }) => {
		await prisma.crochet.delete({
			where: { id: data.id },
		});
		return { success: true };
	});

// Toggle crochet visibility
export const toggleCrochetVisibility = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(ToggleCrochetVisibilitySchema)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.update({
			where: { id: data.id },
			data: { isVisible: data.isVisible },
		});
		return crochet;
	});
