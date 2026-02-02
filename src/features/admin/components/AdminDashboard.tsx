import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
	// Mock data - replace with actual data fetching
	const stats = [
		{
			title: "Total Orders",
			value: "24",
			icon: Package,
			description: "All time orders",
		},
		{
			title: "Pending Orders",
			value: "5",
			icon: TrendingUp,
			description: "Awaiting processing",
		},
		{
			title: "Total Users",
			value: "12",
			icon: Users,
			description: "Registered users",
		},
		{
			title: "Revenue",
			value: "$1,240",
			icon: DollarSign,
			description: "Total revenue",
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
