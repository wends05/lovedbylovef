import { Button } from "@/components/ui/button";

interface OrdersLoadMoreProps {
	hasNextPage: boolean;
	isFetching: boolean;
	onLoadMore: () => void;
}

export function OrdersLoadMore({
	hasNextPage,
	isFetching,
	onLoadMore,
}: OrdersLoadMoreProps) {
	if (!hasNextPage) return null;

	return (
		<div className="flex justify-center pt-4">
			<Button variant="outline" onClick={onLoadMore} disabled={isFetching}>
				{isFetching ? "Loading..." : "Load More"}
			</Button>
		</div>
	);
}
