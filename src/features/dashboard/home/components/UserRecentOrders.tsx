import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDashboardData } from "../../schemas/DashboardData";

type UserRecentOrdersProps = {
	orders: UserDashboardData["recentOrders"];
};

const ORDER_STATUS_STYLES: Record<string, string> = {
	PENDING: "text-yellow-600",
	PROCESSING: "text-blue-600",
	DELIVERED: "text-green-600",
	CANCELED: "text-muted-foreground",
};

export function UserRecentOrders({ orders }: UserRecentOrdersProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Orders</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{orders.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recent orders yet.</p>
				) : (
					orders.map((order) => (
						<div
							key={order.id}
							className="rounded-lg border border-border p-3 space-y-2"
						>
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm font-medium">#{order.id}</p>
								<p
									className={`text-xs font-semibold ${ORDER_STATUS_STYLES[order.status] ?? "text-foreground"}`}
								>
									{order.status}
								</p>
							</div>
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
								<span>
									{typeof order.totalPrice === "number"
										? `₱${order.totalPrice.toFixed(2)}`
										: "—"}
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button
									size="sm"
									variant="outline"
									render={<Link to="/order/$id" params={{ id: order.id }} />}
								>
									View Order
								</Button>
								<Button
									size="sm"
									variant="outline"
									render={
										<Link to="/chat/$orderId" params={{ orderId: order.id }} />
									}
								>
									Open Chat
								</Button>
							</div>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
