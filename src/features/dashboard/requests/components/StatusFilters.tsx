import { REQUEST_STATUS_FILTER_CONFIG } from "@/features/requests/schemas/RequestOptions";
import type { RequestStatus } from "@/generated/prisma/enums";

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
			{(
				Object.keys(REQUEST_STATUS_FILTER_CONFIG) as Array<
					RequestStatus | "ALL"
				>
			).map((status) => {
				const config = REQUEST_STATUS_FILTER_CONFIG[status];
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
			})}
		</div>
	);
}

export const statusConfig = REQUEST_STATUS_FILTER_CONFIG;
