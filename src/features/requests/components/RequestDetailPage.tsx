import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Clock,
	Loader2,
	Package,
	X,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Separator } from "@/components/ui/separator";
import type { RequestStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
import { requestsOptions } from "../options";
import { cancelRequest } from "../server";

const statusConfig: Record<
	RequestStatus,
	{
		label: string;
		color: string;
		bgColor: string;
		icon: React.ElementType;
		description: string;
	}
> = {
	PENDING: {
		label: "Pending",
		color: "text-yellow-600",
		bgColor: "bg-yellow-50",
		icon: Clock,
		description: "Your request is waiting for admin review",
	},
	APPROVED: {
		label: "Approved",
		color: "text-green-600",
		bgColor: "bg-green-50",
		icon: CheckCircle,
		description:
			"Your request has been approved! You can proceed with your order",
	},
	REJECTED: {
		label: "Rejected",
		color: "text-red-600",
		bgColor: "bg-red-50",
		icon: XCircle,
		description: "Unfortunately, your request has been rejected",
	},
	COMPLETED: {
		label: "Completed",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		icon: Package,
		description: "Your crochet order has been completed",
	},
	CANCELLED: {
		label: "Cancelled",
		color: "text-gray-600",
		bgColor: "bg-gray-50",
		icon: AlertCircle,
		description: "You have cancelled this request",
	},
};

export default function RequestDetailPage() {
	const { id } = useParams({ from: "/_protected/request/$id" });
	const { data: request } = useSuspenseQuery(
		requestsOptions.getRequestById(id),
	);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const status = statusConfig[request.status];
	const StatusIcon = status.icon;

	const handleCancel = async () => {
		setIsCancelling(true);

		const { success, error } = await tryCatch(cancelRequest({ data: { id } }));

		if (!success) {
			toast.error("Error", {
				description: error || "Failed to cancel request",
			});
		} else {
			toast.success("Request cancelled", {
				description: "Your request has been cancelled successfully.",
			});
			// Invalidate queries
			queryClient.invalidateQueries({
				queryKey: ["userRequests"],
			});
			queryClient.invalidateQueries({
				queryKey: ["request", id],
			});
		}

		setIsCancelling(false);
		setCancelDialogOpen(false);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<Button
					variant="ghost"
					size="sm"
					className="mb-4 -ml-2"
					onClick={() => navigate({ to: "/requests" })}
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Requests
				</Button>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{request.title}
						</h1>
						<p className="text-muted-foreground">
							Submitted{" "}
							{formatDistanceToNow(new Date(request.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>

					{/* Status Badge */}
					<div
						className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${status.bgColor}`}
					>
						<StatusIcon className={`w-5 h-5 ${status.color}`} />
						<span className={`font-semibold ${status.color}`}>
							{status.label}
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column - Image & Basic Info */}
				<div className="space-y-6">
					{/* Image */}
					<Card className="overflow-hidden">
						<ImageZoom>
							<AspectRatio ratio={4 / 3}>
								{request.imageUrl ? (
									<img
										src={request.imageUrl}
										alt={request.title}
										className="object-cover w-full h-full"
									/>
								) : (
									<div className="w-full h-full bg-muted flex items-center justify-center">
										<Package className="w-16 h-16 text-muted-foreground/50" />
									</div>
								)}
							</AspectRatio>
						</ImageZoom>
					</Card>

					{/* Status Info */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Status Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground">{status.description}</p>

							{request.approvedAt && (
								<div className="text-sm">
									<span className="text-muted-foreground">Approved on: </span>
									<span className="font-medium">
										{format(
											new Date(request.approvedAt),
											"MMM d, yyyy 'at' h:mm a",
										)}
									</span>
								</div>
							)}

							<Separator />

							{/* Action Buttons */}
							{request.status === "PENDING" && (
								<Button
									variant="destructive"
									className="w-full"
									onClick={() => setCancelDialogOpen(true)}
									disabled={isCancelling}
								>
									{isCancelling ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Cancelling...
										</>
									) : (
										<>
											<X className="w-4 h-4 mr-2" />
											Cancel Request
										</>
									)}
								</Button>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details & Admin Response */}
				<div className="space-y-6">
					{/* Description */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Description</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground whitespace-pre-wrap">
								{request.description || "No description provided"}
							</p>
						</CardContent>
					</Card>

					{/* Admin Response */}
					{request.adminResponse && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Admin Response</CardTitle>
								<CardDescription>
									Response from the crochet team
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-muted/50 rounded-lg p-4">
									<p className="text-sm whitespace-pre-wrap">
										{request.adminResponse}
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Request Details */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Request Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Request ID</span>
								<span className="font-mono text-xs">{request.id}</span>
							</div>
							<Separator />
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Submitted</span>
								<span>
									{format(new Date(request.createdAt), "MMM d, yyyy")}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Last Updated</span>
								<span>
									{format(new Date(request.updatedAt), "MMM d, yyyy")}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Cancel Confirmation Dialog */}
			<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Request</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this request? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCancelDialogOpen(false)}
							disabled={isCancelling}
						>
							Keep Request
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancel}
							disabled={isCancelling}
						>
							{isCancelling ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Cancelling...
								</>
							) : (
								"Cancel Request"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
