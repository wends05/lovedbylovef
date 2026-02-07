import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { prisma } from "@/lib/prisma-client";

export const getDashboardData = createServerFn().handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data: authData } = await supabase.auth.getUser();
	const dashboardData = await prisma.$transaction([
		prisma.order.count({
			where: { requestorId: authData.user?.id },
		}),
		prisma.request.count({
			where: { userId: authData.user?.id },
		}),
	]);

	return {
		totalOrders: dashboardData[0],
		totalRequests: dashboardData[1],
	};
});
