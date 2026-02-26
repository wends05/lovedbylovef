import { CheckCircle2, ClipboardList, Package, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDashboardData } from "../../schemas/DashboardData";

type UserKpiGridProps = {
	kpis: UserDashboardData["kpis"];
};

const PRIMARY_KPIS = [
	{
		key: "processingOrders",
		label: "Orders In Progress",
		icon: Timer,
	},
	{
		key: "pendingRequests",
		label: "Pending Requests",
		icon: ClipboardList,
	},
] as const;

const SECONDARY_KPIS = [
	{
		key: "totalOrders",
		label: "Total Orders",
		icon: Package,
	},
	{
		key: "deliveredOrders",
		label: "Delivered",
		icon: CheckCircle2,
	},
	{
		key: "totalRequests",
		label: "Total Requests",
		icon: ClipboardList,
	},
	{
		key: "canceledOrders",
		label: "Canceled",
		icon: Package,
	},
] as const;

export function UserKpiGrid({ kpis }: UserKpiGridProps) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{PRIMARY_KPIS.map((item) => (
					<Card key={item.key} className="border-primary/20">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">
								{item.label}
							</CardTitle>
							<item.icon className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">{kpis[item.key]}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Secondary Metrics</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{SECONDARY_KPIS.map((item) => (
							<div
								key={item.key}
								className="rounded-lg border border-border p-3"
							>
								<div className="mb-1 flex items-center justify-between gap-2">
									<p className="text-xs text-muted-foreground">{item.label}</p>
									<item.icon className="h-3.5 w-3.5 text-muted-foreground" />
								</div>
								<p className="text-xl font-semibold">{kpis[item.key]}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
