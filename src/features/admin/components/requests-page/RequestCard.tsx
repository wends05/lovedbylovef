import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RequestResponseForm } from "./RequestResponseForm";
import { StatusBadge } from "./StatusBadge";

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

interface RequestCardProps {
	request: Request;
	isExpanded: boolean;
	isSubmitting: boolean;
	onToggle: () => void;
	onProcess: (data: {
		response?: string;
		action: "APPROVED" | "REJECTED";
	}) => Promise<void>;
}

export function RequestCard({
	request,
	isExpanded,
	isSubmitting,
	onToggle,
	onProcess,
}: RequestCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<CardTitle className="text-lg">{request.title}</CardTitle>
							<StatusBadge status={request.status} />
						</div>
						<CardDescription>
							From: {request.user.name} ({request.user.email}) •{" "}
							{new Date(request.createdAt).toLocaleDateString()}
						</CardDescription>
					</div>
					<Button variant="ghost" size="icon" onClick={onToggle}>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{request.description}
				</p>

				{isExpanded && (
					<div className="mt-4 space-y-4">
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
								<img
									src={request.imageUrl}
									alt="Reference"
									className="rounded-lg max-h-64 object-cover"
								/>
							</div>
						)}

						{request.status === "PENDING" && (
							<RequestResponseForm
								requestId={request.id}
								isSubmitting={isSubmitting}
								onSubmit={onProcess}
							/>
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
					</div>
				)}
			</CardContent>
		</Card>
	);
}
