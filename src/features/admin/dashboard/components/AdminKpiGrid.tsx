import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardData } from "../schemas/AdminDashboardData";

type AdminKpiGridProps = {
	kpis: AdminDashboardData["kpis"];
};

const ORDER_STATUS_STYLES: Record<string, string> = {
	PENDING: "text-yellow-600 border-yellow-300/50 bg-yellow-50/60",
	PROCESSING: "text-blue-600 border-blue-300/50 bg-blue-50/60",
	DELIVERED: "text-green-600 border-green-300/50 bg-green-50/60",
	CANCELED: "text-muted-foreground border-border bg-muted/30",
};

export function AdminKpiGrid({ kpis }: AdminKpiGridProps) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
			<Card className="xl:col-span-2">
				<CardHeader>
					<CardTitle>Order Lifecycle Funnel</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<div
							className={`rounded-lg border p-4 ${ORDER_STATUS_STYLES.PENDING}`}
						>
							<p className="text-xs font-medium uppercase tracking-wide">
								Pending
							</p>
							<p className="mt-1 text-3xl font-bold">{kpis.pendingOrders}</p>
						</div>
						<div
							className={`rounded-lg border p-4 ${ORDER_STATUS_STYLES.PROCESSING}`}
						>
							<p className="text-xs font-medium uppercase tracking-wide">
								Processing
							</p>
							<p className="mt-1 text-3xl font-bold">{kpis.processingOrders}</p>
						</div>
						<div
							className={`rounded-lg border p-4 ${ORDER_STATUS_STYLES.DELIVERED}`}
						>
							<p className="text-xs font-medium uppercase tracking-wide">
								Delivered
							</p>
							<p className="mt-1 text-3xl font-bold">{kpis.deliveredOrders}</p>
						</div>
					</div>
					<div
						className={`rounded-lg border p-4 ${ORDER_STATUS_STYLES.CANCELED}`}
					>
						<div className="flex items-center justify-between gap-2">
							<p className="text-xs font-medium uppercase tracking-wide">
								Canceled Orders
							</p>
							<p className="text-2xl font-bold">{kpis.canceledOrders}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Delivered Revenue
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">
							₱{kpis.totalRevenueDelivered.toFixed(2)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{kpis.totalUsers}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Total Requests
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{kpis.totalRequests}</p>
						<p className="text-xs text-muted-foreground">
							{kpis.pendingRequests} pending
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{kpis.totalOrders}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
