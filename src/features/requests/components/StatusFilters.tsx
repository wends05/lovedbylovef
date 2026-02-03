import {
	AlertCircle,
	CheckCircle,
	Clock,
	Inbox,
	Package,
	XCircle,
} from "lucide-react";
import type { RequestStatus } from "@/generated/prisma/enums";

const statusConfig: Record<
	RequestStatus | "ALL",
	{ label: string; color: string; icon: React.ElementType }
> = {
	ALL: { label: "All", color: "bg-muted", icon: Inbox },
	PENDING: { label: "Pending", color: "bg-yellow-500", icon: Clock },
	APPROVED: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
	REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
	COMPLETED: { label: "Completed", color: "bg-blue-500", icon: Package },
	CANCELLED: { label: "Cancelled", color: "bg-gray-500", icon: AlertCircle },
};

interface StatusFiltersProps {
	activeFilter: RequestStatus | "ALL";
	onFilterChange: (status: RequestStatus | "ALL") => void;
}

export function StatusFilters({
	activeFilter,
	onFilterChange,
}: StatusFiltersProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{(Object.keys(statusConfig) as Array<RequestStatus | "ALL">).map(
				(status) => {
					const config = statusConfig[status];
					const Icon = config.icon;
					const isActive = activeFilter === status;

					return (
						<button
							key={status}
							onClick={() => onFilterChange(status)}
							className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
								isActive
									? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
						>
							<Icon className="w-4 h-4" />
							{config.label}
						</button>
					);
				},
			)}
		</div>
	);
}

export { statusConfig };
