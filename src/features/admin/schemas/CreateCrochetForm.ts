import z from "zod";

export const CreateCrochetFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	category: z.string().min(1, "Category is required"),
	isVisible: z.boolean(),
	price: z.number().optional(),
});
export type CreateCrochetFormInput = z.infer<typeof CreateCrochetFormSchema>;
