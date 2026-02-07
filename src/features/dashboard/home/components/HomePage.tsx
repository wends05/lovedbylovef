import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						render={<Link to="/create-request" />}
					>
						Create Request
					</Button>
					<Button variant="outline" size="sm" render={<Link to="/gallery" />}>
						Browse Gallery
					</Button>
					<Button variant="outline" size="sm" render={<Link to="/orders" />}>
						Go to Orders
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
