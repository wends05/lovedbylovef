import { queryOptions } from "@tanstack/react-query";
import type { Category } from "@/generated/prisma/client";
import { getCategories, getVisibleCrochets } from "./server";

export const publicQueryOptions = {
	getVisibleCrochets: (category?: Category) =>
		queryOptions({
			queryKey: ["crochets", "gallery", category],
			queryFn: async () =>
				getVisibleCrochets({
					data: { category },
				}),
		}),

	getCategories: () =>
		queryOptions({
			queryKey: ["crochets", "categories"],
			queryFn: async () => getCategories(),
		}),
};
