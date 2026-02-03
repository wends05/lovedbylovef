"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { updateRequestStatus } from "@/features/requests/server";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardOptions } from "../../options";
import { EmptyState } from "./EmptyState";
import { RequestCard } from "./RequestCard";

export default function RequestManagement() {
	const { data: requests } = useSuspenseQuery(
		adminDashboardOptions.getRequests,
	);

	const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleProcessRequest = async (
		requestId: string,
		data: {
			response?: string;
			action: "APPROVED" | "REJECTED";
		},
	) => {
		setIsSubmitting(true);

		const { success, error } = await tryCatch(
			updateRequestStatus({
				data: {
					requestId,
					status: data.action,
					adminResponse: data.response,
				},
			}),
		);

		if (!success) {
			toast.error("Failed to update request status", {
				description: error || "An error occurred while updating the request",
			});
		} else {
			toast.success(`Request ${data.action.toLowerCase()}d successfully`);
			setExpandedRequestId(null);
		}

		setIsSubmitting(false);
	};

	const toggleExpand = (requestId: string) => {
		setExpandedRequestId((prev) => (prev === requestId ? null : requestId));
	};

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
					<EmptyState />
				) : (
					requests.map((request) => (
						<RequestCard
							key={request.id}
							request={request}
							isExpanded={expandedRequestId === request.id}
							isSubmitting={isSubmitting}
							onToggle={() => toggleExpand(request.id)}
							onProcess={(data) => handleProcessRequest(request.id, data)}
						/>
					))
				)}
			</div>
		</div>
	);
}
