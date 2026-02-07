import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";
import { GetUserOrdersSchema } from "./schemas/GetUserOrders";

export const getUserOrders = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(GetUserOrdersSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: authData } = await supabase.auth.getUser();

		if (!authData.user?.id) {
			throw new Error("Unauthorized");
		}

		const pageSize = data.pageSize;

		const orders = await prisma.order.findMany({
			where: {
				requestorId: authData.user.id,
				status: {
					not: "CANCELED",
				},
			},
			orderBy: { createdAt: "desc" },
			take: pageSize + 1,
			...(data.cursor
				? {
						skip: 1,
						cursor: { id: data.cursor },
					}
				: {}),
			include: {
				request: {
					select: {
						title: true,
						description: true,
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
