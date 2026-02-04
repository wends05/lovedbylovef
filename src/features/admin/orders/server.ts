import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/auth/middleware";
import { prisma } from "@/lib/prisma-client";
import { GetOrdersQuerySchema } from "./schemas/GetOrdersQuery";

export const getAllOrders = createServerFn()
	.middleware([adminMiddleware])
	.inputValidator(GetOrdersQuerySchema)
	.handler(async ({ data }) => {
		const pageSize = data.pageSize;
		const orders = await prisma.order.findMany({
			orderBy: { createdAt: "desc" },
			...(data.status && data.status !== "ALL"
				? { where: { status: data.status } }
				: {}),
			take: pageSize + 1,
			...(data.cursor
				? {
						skip: 1,
						cursor: { id: data.cursor },
					}
				: {}),
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		const hasMore = orders.length > pageSize;
		const items = hasMore ? orders.slice(0, pageSize) : orders;
		const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

		return {
			items,
			nextCursor,
			hasMore,
		};
	});
