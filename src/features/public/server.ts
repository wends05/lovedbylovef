import { createServerFn } from "@tanstack/react-start";
import type { Category } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client";

interface GetVisibleCrochetsInput {
	category?: Category;
}

export const getVisibleCrochets = createServerFn({ method: "GET" })
	.inputValidator((input: GetVisibleCrochetsInput) => input)
	.handler(async ({ data }) => {
		const crochets = await prisma.crochet.findMany({
			where: {
				isVisible: true,
				...(data.category ? { category: data.category } : {}),
			},
			orderBy: { createdAt: "desc" },
		});
		return crochets;
	});

export const getCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		// Get unique categories from visible crochets
		const crochets = await prisma.crochet.findMany({
			where: { isVisible: true },
			select: { category: true },
			distinct: ["category"],
		});
		return crochets.map((c) => c.category);
	},
);
