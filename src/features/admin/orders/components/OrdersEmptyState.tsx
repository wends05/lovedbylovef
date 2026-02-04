import { Card, CardContent } from "@/components/ui/card";

export function OrdersEmptyState() {
	return (
		<Card>
			<CardContent className="py-12 text-center">
				<p className="text-muted-foreground">No orders found.</p>
			</CardContent>
		</Card>
	);
}
