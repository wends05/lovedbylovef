import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/auth/middleware";
import { replaceImageWithCleanupOrThrow } from "@/features/storage/replace-image";
import { deleteStorageImageServerOnly } from "@/features/storage/server-only";
import { getStoragePublicUrl } from "@/integrations/supabase/storage-server";
import { prisma } from "@/lib/prisma-client";
import {
	CreateCrochetSchema,
	DeleteCrochetSchema,
	GetCrochetByIdSchema,
	ToggleCrochetVisibilitySchema,
	UpdateCrochetSchema,
} from "./schemas/CrochetSchemas";

function withImageUrl<T extends { imagePath: string }>(crochet: T) {
	return {
		...crochet,
		imageUrl: getStoragePublicUrl(crochet.imagePath),
	};
}

// Get all crochets for admin (including hidden)
export const getAllCrochetsAdmin = createServerFn()
	.middleware([adminMiddleware])
	.handler(async () => {
		const crochets = await prisma.crochet.findMany({
			orderBy: { createdAt: "desc" },
		});
		return crochets.map(withImageUrl);
	});

// Get crochet by ID
export const getCrochetById = createServerFn()
	.middleware([adminMiddleware])
	.inputValidator(GetCrochetByIdSchema)
	.handler(async ({ data }) => {
		const crochet = await prisma.crochet.findUnique({
			where: { id: data.id },
		});
		if (!crochet) {
			throw new Error("Crochet not found");
		}
		return withImageUrl(crochet);
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
				imagePath: data.imagePath,
				imageHash: data.imageHash ?? null,
				isVisible: data.isVisible ?? true,
			},
		});
		return withImageUrl(crochet);
	});

// Update crochet
export const updateCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(UpdateCrochetSchema)
	.handler(async ({ data }) => {
		const { id, ...updateData } = data;
		const existingCrochet = await prisma.crochet.findUnique({
			where: { id },
		});

		if (!existingCrochet) {
			throw new Error("Crochet not found");
		}

		const previousCrochetState = {
			name: existingCrochet.name,
			description: existingCrochet.description,
			category: existingCrochet.category,
			price: existingCrochet.price,
			imagePath: existingCrochet.imagePath,
			imageHash: existingCrochet.imageHash,
			isVisible: existingCrochet.isVisible,
		};

		const nextImagePath = data.imagePath ?? existingCrochet.imagePath;
		const { record, replacedImage } = await replaceImageWithCleanupOrThrow({
			scope: "crochets",
			previousPath: existingCrochet.imagePath,
			nextPath: nextImagePath,
			applyRecordUpdate: () =>
				prisma.crochet.update({
					where: { id },
					data: updateData,
				}),
			rollbackRecordUpdate: () =>
				prisma.crochet.update({
					where: { id },
					data: previousCrochetState,
				}),
			cleanupNewPathOnRollback: true,
		});

		return {
			crochet: withImageUrl(record),
			replacedImage,
		};
	});

// Delete crochet (hard delete)
export const deleteCrochet = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.inputValidator(DeleteCrochetSchema)
	.handler(async ({ data }) => {
		// handle deletion of the image also
		const crochet = await prisma.crochet.findUnique({
			where: { id: data.id },
		});
		if (crochet?.imagePath) {
			await deleteStorageImageServerOnly({
				path: crochet.imagePath,
				scope: "crochets",
			});
		}
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
		return withImageUrl(crochet);
	});
