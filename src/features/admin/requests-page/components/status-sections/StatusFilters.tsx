import { asyncDebounce } from "@tanstack/pacer";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { RequestStatus } from "@/generated/prisma/enums";
import {
	ADMIN_REQUEST_ORDER_OPTIONS,
	ADMIN_REQUEST_SORT_OPTIONS,
} from "@/features/requests/schemas/RequestOptions";

interface FilterState {
	status?: string | RequestStatus;
	pageSize?: number;
	sortBy?: "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
	search?: string;
}

interface StatusFiltersProps {
	filters: FilterState;
	onFilterChange: (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => void;
	onReset: () => void;
}

export function StatusFilters({
	filters,
	onFilterChange,
	onReset,
}: StatusFiltersProps) {
	const [localSearch, setLocalSearch] = useState(filters.search || "");

	// Create debounced search handler
	const debouncedSearch = useMemo(
		() =>
			asyncDebounce(
				async (value: string) => {
					onFilterChange("search", value || undefined);
				},
				{ wait: 300 },
			),
		[onFilterChange],
	);

	const handleSearchChange = (value: string) => {
		setLocalSearch(value);
		void debouncedSearch(value);
	};
	return (
		<div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg border">
			{/* Search */}
			<div className="flex-1 relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by title, description, or user..."
					value={localSearch}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Sort By */}
			<Select
				value={filters.sortBy}
				onValueChange={(value) =>
					onFilterChange("sortBy", value as typeof filters.sortBy)
				}
			>
				<SelectTrigger className="w-45">
					<SelectValue placeholder="Sort by..." />
				</SelectTrigger>
				<SelectContent>
					{ADMIN_REQUEST_SORT_OPTIONS.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Sort Order */}
			<Select
				value={filters.sortOrder}
				onValueChange={(value) =>
					onFilterChange("sortOrder", value as typeof filters.sortOrder)
				}
			>
				<SelectTrigger className="w-37.5">
					<SelectValue placeholder="Order..." />
				</SelectTrigger>
				<SelectContent>
					{ADMIN_REQUEST_ORDER_OPTIONS.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Reset Button */}
			<Button variant="outline" onClick={onReset} size="icon">
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
