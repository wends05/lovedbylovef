import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "@/integrations/uploadthing";

const handlers = createRouteHandler({ router: uploadRouter });

export { handlers as GET, handlers as POST };
