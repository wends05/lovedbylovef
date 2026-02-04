import z from "zod";
import { Category } from "@/generated/prisma/enums";

export const CreateCrochetFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	category: z.enum(Category),
	price: z.number().nullable(),
	imageURL: z.string().optional(),
	imageKey: z.string().optional(),
	imageHash: z.string().optional(),
	isVisible: z.boolean(),
	file: z.file(),
});

export type CreateCrochetFormInput = z.infer<typeof CreateCrochetFormSchema>;

export const CreateCrochetSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	category: z.enum(Category),
	price: z.number().nullable(),
	imageURL: z.string().min(1, "Image is required"),
	imageKey: z.string().optional(),
	imageHash: z.string().optional(),
	isVisible: z.boolean(),
});

export type CreateCrochetInput = z.infer<typeof CreateCrochetSchema>;

export const UpdateCrochetSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required").optional(),
	description: z.string().min(1, "Description is required").optional(),
	category: z.enum(Category),
	price: z.number().nullable(),
	imageURL: z.string().optional(),
	imageKey: z.string().optional(),
	imageHash: z.string().optional(),
	isVisible: z.boolean().optional(),
});

export type UpdateCrochetInput = z.infer<typeof UpdateCrochetSchema>;

export const UpdateCrochetFormSchema = UpdateCrochetSchema.extend({
	file: z.file().optional(),
});

export type UpdateCrochetFormInput = z.infer<typeof UpdateCrochetFormSchema>;

export const DeleteCrochetSchema = z.object({
	id: z.string(),
});

export type DeleteCrochetInput = z.infer<typeof DeleteCrochetSchema>;

export const ToggleCrochetVisibilitySchema = z.object({
	id: z.string(),
	isVisible: z.boolean(),
});

export type ToggleCrochetVisibilityInput = z.infer<
	typeof ToggleCrochetVisibilitySchema
>;

export const GetCrochetByIdSchema = z.object({
	id: z.string(),
});

export type GetCrochetByIdInput = z.infer<typeof GetCrochetByIdSchema>;
