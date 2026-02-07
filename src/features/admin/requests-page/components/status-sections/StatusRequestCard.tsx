import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
					<div className="flex items-center gap-2">
						<Link
							to="/request/$id"
							params={{ id: request.id }}
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							View Details
						</Link>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
