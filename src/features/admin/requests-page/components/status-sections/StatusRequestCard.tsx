import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "../shared/StatusBadge";

interface Request {
	id: string;
	title: string;
	description: string;
	status: string;
	imageUrl: string | null;
	adminResponse: string | null;
	createdAt: Date;
	user: {
		name: string;
		email: string;
	};
}

interface StatusRequestCardProps {
	request: Request;
}

export function StatusRequestCard({ request }: StatusRequestCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<CardTitle className="text-base">{request.title}</CardTitle>
							<StatusBadge status={request.status} />
						</div>
						<CardDescription>
							From: {request.user.name} •{" "}
							{new Date(request.createdAt).toLocaleDateString()}
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent className="space-y-4">
					<Separator />

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
										className="w-full h-48 object-contain"
									/>
								</ImageZoom>
							</div>
						</div>
					)}

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
			)}
		</Card>
	);
}
