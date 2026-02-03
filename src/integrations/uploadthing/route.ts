import type { FileRouter } from "uploadthing/server";
import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "8MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			// This code runs on your server before upload
			console.log("Upload middleware running");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: "user_123" };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return {
				uploadedBy: metadata.userId,
				url: file.url,
				name: file.name,
				size: file.size,
			};
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
