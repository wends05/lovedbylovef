import type { FileRouter } from "uploadthing/server";
import { createUploadthing, UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

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
	}).onUploadComplete(async ({ file }) => {
		// This code RUNS ON YOUR SERVER after upload
		console.log("file url", file.ufsUrl);

		// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
		return { uploadedBy: "someone" };
	}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
