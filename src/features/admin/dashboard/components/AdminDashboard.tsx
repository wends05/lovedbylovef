import { useSuspenseQuery } from "@tanstack/react-query";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminDashboardQueryOptions } from "../../options";

export default function AdminDashboard() {
	const { data } = useSuspenseQuery(
		adminDashboardQueryOptions.getAdminDashboardData,
	);

	const stats = [
		{
			title: "Pending Orders",
			value: data?.pendingOrders ?? 0,
			description: "Orders awaiting processing",
			icon: Package,
		},
		{
			title: "Total Orders",
			value: data?.totalOrders ?? 0,
			description: "All orders placed",
			icon: TrendingUp,
		},
		{
			title: "Total Users",
			value: data?.totalUsers ?? 0,
			description: "Registered users",
			icon: Users,
		},
		{
			title: "Total Revenue",
			value: `₱${data?.totalRevenue.toFixed(2) ?? "0.00"}`,
			description: "Revenue from delivered orders",
			icon: DollarSign,
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Admin Dashboard
				</h1>
				<p className="text-muted-foreground mt-1">
					Welcome back! Here's what's happening with your store.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Recent orders will be displayed here once connected to your
						database.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
