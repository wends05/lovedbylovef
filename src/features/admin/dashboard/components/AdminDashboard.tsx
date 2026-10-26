import { useSuspenseQuery } from "@tanstack/react-query";
import { adminDashboardQueryOptions } from "../../options";
import { AdminKpiGrid } from "./AdminKpiGrid";
import { AdminRecentOrders } from "./AdminRecentOrders";
import { AdminRecentRequests } from "./AdminRecentRequests";

export default function AdminDashboard() {
	const { data } = useSuspenseQuery(
		adminDashboardQueryOptions.getAdminDashboardData,
	);

	return (
		<div className="space-y-8">
			<AdminKpiGrid kpis={data.kpis} />
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<AdminRecentOrders orders={data.recentOrders} />
				<AdminRecentRequests requests={data.recentRequests} />
			</div>
		</div>
	);
}
