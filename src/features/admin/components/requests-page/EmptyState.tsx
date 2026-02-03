import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
	return (
		<Card>
			<CardContent className="py-8 text-center">
				<p className="text-muted-foreground">
					No requests found. When users submit custom order requests, they will
					appear here.
				</p>
			</CardContent>
		</Card>
	);
}
