import { Skeleton } from "@/components/ui/skeleton";

export function GallerySkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-10 w-32" />
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				<Skeleton className="h-10 flex-1" />
				<Skeleton className="h-10 w-45" />
				<Skeleton className="h-10 w-37.5" />
				<Skeleton className="h-10 w-45" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Skeleton key={i} className="h-80" />
				))}
			</div>
		</div>
	);
}
