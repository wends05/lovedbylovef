import z from "zod";

export const RequestFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	file: z.file().optional(),
});

export type RequestFormInput = z.infer<typeof RequestFormSchema>;

export const RequestFormSubmission = z.object({
	title: z.string(),
	description: z.string(),
	imageUrl: z.string().optional(),
	imageKey: z.string().optional(),
});
export type RequestFormSubmission = z.infer<typeof RequestFormSubmission>;

export const UpdateRequestFormSchema = RequestFormSchema.extend({
	id: z.string(),
});

export type UpdateRequestFormInput = z.infer<typeof UpdateRequestFormSchema>;

export const UpdateRequestSubmissionSchema = RequestFormSubmission.extend({
	id: z.string(),
});

export type UpdateRequestSubmission = z.infer<
	typeof UpdateRequestSubmissionSchema
>;
