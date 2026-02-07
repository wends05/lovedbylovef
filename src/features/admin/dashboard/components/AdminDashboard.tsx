import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Admin Dashboard
				</h1>
				<p className="text-muted-foreground mt-1">
					Overview of order flow, requests, and store health.
				</p>
			</div>

			<AdminKpiGrid kpis={data.kpis} />

			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						render={<Link to="/admin/orders" />}
					>
						Manage Orders
					</Button>
					<Button
						variant="outline"
						size="sm"
						render={<Link to="/admin/requests" />}
					>
						Review Requests
					</Button>
					<Button
						variant="outline"
						size="sm"
						render={<Link to="/admin/gallery" />}
					>
						Manage Gallery
					</Button>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<AdminRecentOrders orders={data.recentOrders} />
				<AdminRecentRequests requests={data.recentRequests} />
			</div>
		</div>
	);
}
