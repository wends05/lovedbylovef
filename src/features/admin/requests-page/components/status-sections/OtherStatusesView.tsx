import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestStatus } from "@/generated/prisma/enums";
import type { RequestSearchParams } from "../../schemas/RequestSearchParams";
import { StatusFilters } from "./StatusFilters";
import { StatusSection } from "./StatusSection";

// Get typed route API
const routeApi = getRouteApi("/admin/requests");

// Type for non-pending statuses (used in this component)
type NonPendingStatus = Exclude<RequestStatus, "PENDING">;

const OTHER_STATUSES = [
	{ value: RequestStatus.APPROVED, label: "Approved" },
	{ value: RequestStatus.REJECTED, label: "Rejected" },
	{ value: RequestStatus.COMPLETED, label: "Completed" },
	{ value: RequestStatus.CANCELLED, label: "Cancelled" },
] as const;

interface OtherStatusesViewProps {
	initialStatus: NonPendingStatus;
	initialSearch?: string;
	initialSortBy?: "createdAt" | "updatedAt" | "userName";
	initialSortOrder?: "asc" | "desc";
	initialDateFrom?: string;
	initialDateTo?: string;
}

const DEFAULT_FILTERS = {
	pageSize: 20,
	sortBy: "createdAt" as const,
	sortOrder: "desc" as const,
};

export function OtherStatusesView({
	initialStatus,
	initialSearch,
	initialSortBy,
	initialSortOrder,
	initialDateFrom,
	initialDateTo,
}: OtherStatusesViewProps) {
	const navigate = routeApi.useNavigate();
	const queryClient = useQueryClient();

	// Initialize active tab from props
	const [activeTab, setActiveTab] = useState<NonPendingStatus>(initialStatus);

	// Initialize filters from props
	const [filters, setFilters] = useState<{
		status: NonPendingStatus;
		pageSize: number;
		sortBy: "createdAt" | "updatedAt" | "userName";
		sortOrder: "asc" | "desc";
		search?: string;
		dateFrom?: string;
		dateTo?: string;
	}>({
		status: initialStatus,
		pageSize: DEFAULT_FILTERS.pageSize,
		sortBy: initialSortBy ?? DEFAULT_FILTERS.sortBy,
		sortOrder: initialSortOrder ?? DEFAULT_FILTERS.sortOrder,
		search: initialSearch,
		dateFrom: initialDateFrom,
		dateTo: initialDateTo,
	});

	// Sync filters to URL with type-safe navigation
	const syncToUrl = useCallback(
		(newFilters: typeof filters, newTab: NonPendingStatus) => {
			// Build search params that match RequestSearchParams type
			const search: Partial<RequestSearchParams> = {};

			// Only include non-default values
			if (newTab !== RequestStatus.APPROVED) {
				search.status = newTab;
			}
			if (newFilters.search) {
				search.search = newFilters.search;
			}
			if (newFilters.sortBy !== "createdAt") {
				search.sortBy = newFilters.sortBy;
			}
			if (newFilters.sortOrder !== "desc") {
				search.sortOrder = newFilters.sortOrder;
			}
			if (newFilters.dateFrom) {
				search.dateFrom = newFilters.dateFrom;
			}
			if (newFilters.dateTo) {
				search.dateTo = newFilters.dateTo;
			}

			// Type-safe navigation using the current route
			navigate({
				to: ".", // Stay on current route
				search,
				replace: true,
			});
		},
		[navigate],
	);

	// Handle tab change
	const handleTabChange = useCallback(
		(value: string) => {
			const newStatus = value as NonPendingStatus;
			setActiveTab(newStatus);

			const newFilters = { ...filters, status: newStatus };
			setFilters(newFilters);

			// Invalidate query to refetch with new status
			queryClient.invalidateQueries({
				queryKey: ["adminRequests"],
			});

			syncToUrl(newFilters, newStatus);
		},
		[filters, queryClient, syncToUrl],
	);

	// Handle filter change - simplified signature to match StatusFiltersProps
	const handleFilterChange = useCallback(
		(
			key: keyof typeof filters,
			value: (typeof filters)[keyof typeof filters],
		) => {
			const newFilters = { ...filters, [key]: value };
			setFilters(newFilters);
			syncToUrl(newFilters, activeTab);
		},
		[filters, activeTab, syncToUrl],
	);

	// Handle reset
	const handleReset = useCallback(() => {
		const resetFilters = {
			status: activeTab,
			pageSize: DEFAULT_FILTERS.pageSize,
			sortBy: DEFAULT_FILTERS.sortBy,
			sortOrder: DEFAULT_FILTERS.sortOrder,
			search: undefined,
			dateFrom: undefined,
			dateTo: undefined,
		};
		setFilters(resetFilters);
		syncToUrl(resetFilters, activeTab);
	}, [activeTab, syncToUrl]);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Request History</h2>

			{/* Filters */}
			<StatusFilters
				filters={filters}
				onFilterChange={handleFilterChange}
				onReset={handleReset}
			/>

			{/* Desktop Tabs */}
			<div className="hidden md:block">
				<Tabs value={activeTab} onValueChange={handleTabChange}>
					<TabsList className="grid w-full grid-cols-4">
						{OTHER_STATUSES.map((status) => (
							<TabsTrigger key={status.value} value={status.value}>
								{status.label}
							</TabsTrigger>
						))}
					</TabsList>

					{OTHER_STATUSES.map((status) => (
						<TabsContent key={status.value} value={status.value}>
							<StatusSection
								status={status.value}
								search={filters.search}
								sortBy={filters.sortBy}
								sortOrder={filters.sortOrder}
								dateFrom={filters.dateFrom}
								dateTo={filters.dateTo}
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>

			{/* Mobile Select */}
			<div className="md:hidden space-y-4">
				<Select
					value={activeTab}
					onValueChange={(value) => value && handleTabChange(value)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select status..." />
					</SelectTrigger>
					<SelectContent>
						{OTHER_STATUSES.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<StatusSection
					status={activeTab}
					search={filters.search}
					sortBy={filters.sortBy}
					sortOrder={filters.sortOrder}
					dateFrom={filters.dateFrom}
					dateTo={filters.dateTo}
				/>
			</div>
		</div>
	);
}
