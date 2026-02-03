import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "./route";

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<UploadRouter>({
		url: "/api/uploadthing",
	});
