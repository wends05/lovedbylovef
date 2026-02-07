import { formatDistanceToNow } from "date-fns";
import {
	Eye,
	MessageCircleMore,
	MoreVertical,
	Package,
	Pencil,
	X,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { REQUEST_STATUS_BADGE_CONFIG } from "@/features/requests/schemas/RequestOptions";
import type { Request } from "@/generated/prisma/client";

type RequestWithOrder = Request & {
	order?: {
		id: string;
	} | null;
};

interface RequestCardProps {
	request: RequestWithOrder;
	onCancel: () => void;
	onEdit: () => void;
	onView: () => void;
	onChat: (orderId: string) => void;
}

export function RequestCard({
	request,
	onCancel,
	onEdit,
	onView,
	onChat,
}: RequestCardProps) {
	const status = REQUEST_STATUS_BADGE_CONFIG[request.status];
	const StatusIcon = status.icon;
	const orderId = request.order?.id;

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
			<CardHeader className="pb-3 h-full">
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
								<DropdownMenuItem onClick={onEdit}>
									<Pencil className="w-4 h-4 mr-2" />
									Edit Request
								</DropdownMenuItem>
							)}
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
			</CardHeader>

			<CardContent className="pt-0">
				{/* Status Badge */}
				<div className="flex flex-col gap-3">
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
					{orderId && (
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => onChat(orderId)}
						>
							<MessageCircleMore className="w-4 h-4 mr-2" />
							Chat
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
