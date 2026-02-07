import {
	AlertCircle,
	CheckCircle,
	Clock,
	Inbox,
	Package,
	XCircle,
} from "lucide-react";
import { RequestStatus } from "@/generated/prisma/enums";

export const REQUEST_STATUS_BADGE_CONFIG = {
	PENDING: { label: "Pending", color: "bg-yellow-500", icon: Clock },
	APPROVED: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
	REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
	COMPLETED: { label: "Completed", color: "bg-blue-500", icon: Package },
	CANCELLED: { label: "Cancelled", color: "bg-gray-500", icon: AlertCircle },
} as const;

export const REQUEST_STATUS_FILTER_CONFIG = {
	ALL: { label: "All", color: "bg-muted", icon: Inbox },
	...REQUEST_STATUS_BADGE_CONFIG,
} as const;

export const REQUEST_STATUS_DETAIL_CONFIG = {
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
} as const;

export const REQUEST_STATUSES_FOR_INVALIDATION: Array<RequestStatus | "ALL"> = [
	"ALL",
	RequestStatus.PENDING,
	RequestStatus.APPROVED,
	RequestStatus.REJECTED,
	RequestStatus.COMPLETED,
	RequestStatus.CANCELLED,
];

export const ADMIN_REQUEST_STATUS_TABS = [
	{ value: RequestStatus.APPROVED, label: "Approved" },
	{ value: RequestStatus.REJECTED, label: "Rejected" },
	{ value: RequestStatus.COMPLETED, label: "Completed" },
	{ value: RequestStatus.CANCELLED, label: "Cancelled" },
] as const;

export const ADMIN_REQUEST_SORT_OPTIONS = [
	{ value: "createdAt", label: "Date Created" },
	{ value: "updatedAt", label: "Date Updated" },
] as const;

export const ADMIN_REQUEST_ORDER_OPTIONS = [
	{ value: "desc", label: "Newest First" },
	{ value: "asc", label: "Oldest First" },
] as const;

export const ADMIN_REQUEST_DEFAULT_FILTERS = {
	pageSize: 20,
	sortBy: "createdAt" as const,
	sortOrder: "desc" as const,
};
