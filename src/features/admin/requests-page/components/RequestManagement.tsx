import { Separator } from "@/components/ui/separator";
import { RequestStatus } from "@/generated/prisma/enums";
// Import the route to get typed search params
import { Route } from "@/routes/admin/requests";
import { PendingRequestsFeed } from "./feed/PendingRequestsFeed";
import { OtherStatusesView } from "./status-sections/OtherStatusesView";

export default function RequestManagement() {
	// Use typed search params from the route (validated by Zod schema)
	const search = Route.useSearch();

	// Get initial status from URL, fallback to APPROVED if not set
	// Note: This component only handles non-pending statuses
	const initialStatusTab = (search.status ?? RequestStatus.APPROVED) as Exclude<
		RequestStatus,
		"PENDING"
	>;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Request Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Review and manage custom order requests from users
				</p>
			</div>

			{/* Pending Requests Feed */}
			<PendingRequestsFeed />

			<Separator className="my-8" />

			{/* Other Statuses (Tabs with filters and URL sync) */}
			<OtherStatusesView
				initialStatus={initialStatusTab}
				initialSearch={search.search}
				initialSortBy={search.sortBy}
				initialSortOrder={search.sortOrder}
			/>
		</div>
	);
}
