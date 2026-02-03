import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RequestSkeletonProps {
	count?: number;
}

export function RequestSkeleton({ count = 6 }: RequestSkeletonProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<Card key={i} className="overflow-hidden">
					<Skeleton className="aspect-[4/3] w-full" />
					<CardHeader>
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
