import { Card, CardContent } from "@/components/ui/card";

interface OrdersEmptyStateProps {
	message?: string;
}

export function OrdersEmptyState({
	message = "No orders found.",
}: OrdersEmptyStateProps) {
	return (
		<Card>
			<CardContent className="py-12 text-center">
				<p className="text-muted-foreground">{message}</p>
			</CardContent>
		</Card>
	);
}
