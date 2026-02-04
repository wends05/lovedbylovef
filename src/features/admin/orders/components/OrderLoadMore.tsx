import { Button } from "@/components/ui/button";

interface OrderLoadMoreProps {
	hasNextPage: boolean;
	isFetching: boolean;
	onLoadMore: () => void;
}

export function OrderLoadMore({
	hasNextPage,
	isFetching,
	onLoadMore,
}: OrderLoadMoreProps) {
	if (!hasNextPage) return null;

	return (
		<div className="flex justify-center pt-4">
			<Button variant="outline" onClick={onLoadMore} disabled={isFetching}>
				{isFetching ? "Loading..." : "Load More"}
			</Button>
		</div>
	);
}
