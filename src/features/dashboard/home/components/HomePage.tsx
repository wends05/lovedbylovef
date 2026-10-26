import { useSuspenseQuery } from "@tanstack/react-query";
import { dashboardQueryOptions } from "../../options";
import { UserKpiGrid } from "./UserKpiGrid";
import { UserRecentOrders } from "./UserRecentOrders";
import { UserRecentRequests } from "./UserRecentRequests";

export default function HomePage() {
	const { data } = useSuspenseQuery(dashboardQueryOptions.getDashboardData);

	return (
		<div className="w-full space-y-8">
			<UserKpiGrid kpis={data.kpis} />

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<UserRecentOrders orders={data.recentOrders} />
				<UserRecentRequests requests={data.recentRequests} />
			</div>
		</div>
	);
}
