import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardData } from "../schemas/AdminDashboardData";

type AdminRecentRequestsProps = {
	requests: AdminDashboardData["recentRequests"];
};

const REQUEST_STATUS_STYLES: Record<string, string> = {
	PENDING: "text-yellow-600",
	APPROVED: "text-green-600",
	REJECTED: "text-red-600",
	COMPLETED: "text-blue-600",
	CANCELLED: "text-muted-foreground",
};

export function AdminRecentRequests({ requests }: AdminRecentRequestsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Requests</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{requests.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recent requests yet.</p>
				) : (
					requests.map((request) => (
						<div
							key={request.id}
							className="rounded-lg border border-border p-3 space-y-2"
						>
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm font-medium">
									{request.user.name ?? "User"} ({request.user.email})
								</p>
								<p
									className={`text-xs font-semibold ${REQUEST_STATUS_STYLES[request.status] ?? "text-foreground"}`}
								>
									{request.status}
								</p>
							</div>
							<p className="text-sm font-medium line-clamp-1">{request.title}</p>
							<p className="text-xs text-muted-foreground">
								{format(new Date(request.createdAt), "MMM d, yyyy")}
							</p>
							<Button
								size="sm"
								variant="outline"
								render={<Link to="/request/$id" params={{ id: request.id }} />}
							>
								View Request
							</Button>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
