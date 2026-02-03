import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RequestStatus } from "@/generated/prisma/enums";

interface EmptyStateProps {
	activeFilter: RequestStatus | "ALL";
	onViewAll: () => void;
	statusLabel: string;
}

export function EmptyState({
	activeFilter,
	onViewAll,
	statusLabel,
}: EmptyStateProps) {
	return (
		<div className="text-center py-16">
			<div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
				<Inbox className="w-10 h-10 text-muted-foreground" />
			</div>
			<h3 className="text-xl font-semibold mb-2">No requests found</h3>
			<p className="text-muted-foreground max-w-md mx-auto">
				{activeFilter === "ALL"
					? "You haven't made any requests yet. Start by creating your first crochet order!"
					: `You don't have any ${statusLabel.toLowerCase()} requests.`}
			</p>
			{activeFilter !== "ALL" && (
				<Button variant="outline" className="mt-4" onClick={onViewAll}>
					View all requests
				</Button>
			)}
		</div>
	);
}
