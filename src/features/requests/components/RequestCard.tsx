import { formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Eye,
	MoreVertical,
	Package,
	X,
	XCircle,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RequestStatus } from "@/generated/prisma/enums";
import type { Request } from "./types";

const statusConfig: Record<
	RequestStatus,
	{ label: string; color: string; icon: React.ElementType }
> = {
	PENDING: { label: "Pending", color: "bg-yellow-500", icon: Clock },
	APPROVED: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
	REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
	COMPLETED: { label: "Completed", color: "bg-blue-500", icon: Package },
	CANCELLED: { label: "Cancelled", color: "bg-gray-500", icon: AlertCircle },
};

interface RequestCardProps {
	request: Request;
	onCancel: () => void;
	onView: () => void;
}

export function RequestCard({ request, onCancel, onView }: RequestCardProps) {
	const status = statusConfig[request.status];
	const StatusIcon = status.icon;

	return (
		<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
			{/* Image */}
			<button onClick={onView} className="block w-full">
				<AspectRatio ratio={4 / 3}>
					{request.imageUrl ? (
						<img
							src={request.imageUrl}
							alt={request.title}
							className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
						/>
					) : (
						<div className="w-full h-full bg-muted flex items-center justify-center">
							<Package className="w-12 h-12 text-muted-foreground/50" />
						</div>
					)}
				</AspectRatio>
			</button>

			{/* Content */}
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg font-semibold line-clamp-1">
							<button
								onClick={onView}
								className="hover:text-primary transition-colors text-left w-full"
							>
								{request.title}
							</button>
						</CardTitle>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="ghost" size="icon" className="shrink-0">
									<MoreVertical className="w-4 h-4" />
								</Button>
							}
						/>

						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={onView}>
								<Eye className="w-4 h-4 mr-2" />
								View Details
							</DropdownMenuItem>
							{request.status === "PENDING" && (
								<DropdownMenuItem
									onClick={onCancel}
									className="text-destructive focus:text-destructive"
								>
									<X className="w-4 h-4 mr-2" />
									Cancel Request
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<CardDescription className="line-clamp-2 mt-2">
					{request.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-0">
				{/* Status Badge */}
				<div className="flex items-center justify-between">
					<div
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} text-white`}
					>
						<StatusIcon className="w-3 h-3" />
						{status.label}
					</div>
					<span className="text-xs text-muted-foreground">
						{formatDistanceToNow(new Date(request.createdAt), {
							addSuffix: true,
						})}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
