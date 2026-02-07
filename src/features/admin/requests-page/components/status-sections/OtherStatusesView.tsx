import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ADMIN_REQUEST_DEFAULT_FILTERS,
	ADMIN_REQUEST_STATUS_TABS,
} from "@/features/requests/schemas/RequestOptions";
import { RequestStatus } from "@/generated/prisma/enums";
import type { RequestSearchParams } from "../../schemas/RequestSearchParams";
import { StatusFilters } from "./StatusFilters";
import { StatusSection } from "./StatusSection";

// Get typed route API
const routeApi = getRouteApi("/admin/requests");

// Type for non-pending statuses (used in this component)
type NonPendingStatus = Exclude<RequestStatus, "PENDING">;

interface OtherStatusesViewProps {
	initialStatus: NonPendingStatus;
	initialSearch?: string;
	initialSortBy?: "createdAt" | "updatedAt";
	initialSortOrder?: "asc" | "desc";
}

export function OtherStatusesView({
	initialStatus,
	initialSearch,
	initialSortBy,
	initialSortOrder,
}: OtherStatusesViewProps) {
	const navigate = routeApi.useNavigate();
	const queryClient = useQueryClient();

	// Initialize active tab from props
	const [activeTab, setActiveTab] = useState<NonPendingStatus>(initialStatus);

	// Initialize filters from props
	const [filters, setFilters] = useState<{
		status: NonPendingStatus;
		pageSize: number;
		sortBy: "createdAt" | "updatedAt";
		sortOrder: "asc" | "desc";
		search?: string;
	}>({
		status: initialStatus,
		pageSize: ADMIN_REQUEST_DEFAULT_FILTERS.pageSize,
		sortBy: initialSortBy ?? ADMIN_REQUEST_DEFAULT_FILTERS.sortBy,
		sortOrder: initialSortOrder ?? ADMIN_REQUEST_DEFAULT_FILTERS.sortOrder,
		search: initialSearch,
	});

	// Sync filters to URL with type-safe navigation
	const syncToUrl = (newFilters: typeof filters, newTab: NonPendingStatus) => {
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

		// Type-safe navigation using the current route
		navigate({
			to: ".", // Stay on current route
			search,
			replace: true,
		});
	};

	// Handle tab change
	const handleTabChange = (value: string) => {
		const newStatus = value as NonPendingStatus;
		setActiveTab(newStatus);

		const newFilters = { ...filters, status: newStatus };
		setFilters(newFilters);

		// Invalidate query to refetch with new status
		queryClient.invalidateQueries({
			queryKey: ["adminRequests"],
		});

		syncToUrl(newFilters, newStatus);
	};
	// Handle filter change - simplified signature to match StatusFiltersProps
	const handleFilterChange = (
		key: keyof typeof filters,
		value: (typeof filters)[keyof typeof filters],
	) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		syncToUrl(newFilters, activeTab);
	};

	// Handle reset
	const handleReset = () => {
		const resetFilters = {
			status: activeTab,
			pageSize: ADMIN_REQUEST_DEFAULT_FILTERS.pageSize,
			sortBy: ADMIN_REQUEST_DEFAULT_FILTERS.sortBy,
			sortOrder: ADMIN_REQUEST_DEFAULT_FILTERS.sortOrder,
			search: undefined,
		};
		setFilters(resetFilters);
		syncToUrl(resetFilters, activeTab);
	};

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
						{ADMIN_REQUEST_STATUS_TABS.map((status) => (
							<TabsTrigger key={status.value} value={status.value}>
								{status.label}
							</TabsTrigger>
						))}
					</TabsList>

					{ADMIN_REQUEST_STATUS_TABS.map((status) => (
						<TabsContent key={status.value} value={status.value}>
							<StatusSection
								status={status.value}
								search={filters.search}
								sortBy={filters.sortBy}
								sortOrder={filters.sortOrder}
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
						{ADMIN_REQUEST_STATUS_TABS.map((status) => (
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
				/>
			</div>
		</div>
	);
}
