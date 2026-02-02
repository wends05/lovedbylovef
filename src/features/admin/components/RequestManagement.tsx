"use client";

import {
	Check,
	ChevronDown,
	ChevronUp,
	Eye,
	MessageSquare,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	getAllRequests,
	updateRequestStatus,
} from "@/features/requests/server";

interface RequestWithUser {
	id: string;
	userId: string;
	title: string;
	description: string;
	imageUrl: string | null;
	status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
	adminResponse: string | null;
	approvedAt: Date | null;
	approvedBy: string | null;
	createdAt: Date;
	updatedAt: Date;
	user: {
		name: string;
		email: string;
	};
}

const statusColors: Record<string, string> = {
	PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
	REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
	COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function RequestManagement() {
	const [requests, setRequests] = useState<RequestWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
		null,
	);
	const [adminResponses, setAdminResponses] = useState<Record<string, string>>(
		{},
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		loadRequests();
	}, []);

	const loadRequests = async () => {
		try {
			const data = await getAllRequests();
			setRequests(data as RequestWithUser[]);
		} catch (error) {
			toast.error("Failed to load requests");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusUpdate = async (
		requestId: string,
		status: "APPROVED" | "REJECTED",
	) => {
		setIsSubmitting(true);
		try {
			await updateRequestStatus({
				data: {
					requestId,
					status,
					adminResponse: adminResponses[requestId] || undefined,
				},
			});

			toast.success(`Request ${status.toLowerCase()} successfully`);

			await loadRequests();
			setExpandedRequestId(null);
			setAdminResponses((prev) => {
				const newResponses = { ...prev };
				delete newResponses[requestId];
				return newResponses;
			});
		} catch (error) {
			toast.error("Failed to update request status");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleExpand = (requestId: string) => {
		setExpandedRequestId((prev) => (prev === requestId ? null : requestId));
	};

	const handleAdminResponseChange = (requestId: string, value: string) => {
		setAdminResponses((prev) => ({ ...prev, [requestId]: value }));
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Request Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Review and manage custom order requests from users
				</p>
			</div>

			<div className="grid gap-4">
				{requests.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center">
							<p className="text-muted-foreground">
								No requests found. When users submit custom order requests, they
								will appear here.
							</p>
						</CardContent>
					</Card>
				) : (
					requests.map((request) => {
						const isExpanded = expandedRequestId === request.id;
						return (
							<Card key={request.id}>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div>
											<div className="flex items-center gap-2 mb-2">
												<CardTitle className="text-lg">
													{request.title}
												</CardTitle>
												<Badge
													variant="outline"
													className={statusColors[request.status]}
												>
													{request.status}
												</Badge>
											</div>
											<CardDescription>
												From: {request.user.name} ({request.user.email}) •{" "}
												{new Date(request.createdAt).toLocaleDateString()}
											</CardDescription>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleExpand(request.id)}
										>
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
													<h4 className="font-semibold mb-2">
														Reference Image
													</h4>
													<img
														src={request.imageUrl}
														alt="Reference"
														className="rounded-lg max-h-64 object-cover"
													/>
												</div>
											)}

											{request.status === "PENDING" && (
												<div className="space-y-4 pt-4 border-t">
													<div>
														<Label htmlFor={`response-${request.id}`}>
															Response to User
														</Label>
														<Textarea
															id={`response-${request.id}`}
															placeholder="Enter your response to the user (optional)"
															value={adminResponses[request.id] || ""}
															onChange={(e) =>
																handleAdminResponseChange(
																	request.id,
																	e.target.value,
																)
															}
															rows={3}
														/>
													</div>

													<div className="flex gap-2">
														<Button
															variant="outline"
															onClick={() =>
																handleStatusUpdate(request.id, "REJECTED")
															}
															disabled={isSubmitting}
														>
															<X className="h-4 w-4 mr-2" />
															Reject
														</Button>
														<Button
															onClick={() =>
																handleStatusUpdate(request.id, "APPROVED")
															}
															disabled={isSubmitting}
														>
															<Check className="h-4 w-4 mr-2" />
															Approve
														</Button>
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
										</div>
									)}
								</CardContent>
							</Card>
						);
					})
				)}
			</div>
		</div>
	);
}
