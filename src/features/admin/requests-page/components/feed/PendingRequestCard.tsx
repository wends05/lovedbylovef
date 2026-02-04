import { MessageSquare } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Separator } from "@/components/ui/separator";
import type { UpdateRequestStatusInput } from "@/features/requests/schemas/UpdateRequestStatus";
import type { AdminRequestItem } from "@/features/requests/types";
import { RequestResponseForm } from "../RequestResponseForm";
import { StatusBadge } from "../shared/StatusBadge";

interface PendingRequestCardProps {
	request: AdminRequestItem;
	onProcess: (data: UpdateRequestStatusInput) => Promise<void>;
}

export function PendingRequestCard({
	request,
	onProcess,
}: PendingRequestCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<CardTitle className="text-lg">{request.title}</CardTitle>
							<StatusBadge status={request.status} />
						</div>
						<CardDescription>
							From: {request.user.name} ({request.user.email}) •{" "}
							{new Date(request.createdAt).toLocaleDateString()}
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div>
					<h4 className="font-semibold mb-2">Description</h4>
					<p className="text-sm text-muted-foreground whitespace-pre-wrap">
						{request.description}
					</p>
				</div>

				{request.imageUrl && (
					<div>
						<h4 className="font-semibold mb-2">Reference Image</h4>
						<div className="relative rounded-lg overflow-hidden border border-border bg-muted/50">
							<ImageZoom>
								<img
									src={request.imageUrl}
									alt="Reference"
									className="w-full h-64 object-contain"
								/>
							</ImageZoom>
						</div>
					</div>
				)}

				<Separator />

				<RequestResponseForm
					requestId={request.id}
					isSubmitting={false}
					onSubmit={onProcess}
				/>

				{request.adminResponse && (
					<div className="pt-4 border-t">
						<h4 className="font-semibold mb-2 flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							Admin Response
						</h4>
						<p className="text-sm text-muted-foreground">
							{request.adminResponse}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
