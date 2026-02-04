import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
	message?: string;
	title?: string;
}

export function EmptyState({
	message = "No requests found. When users submit custom order requests, they will appear here.",
	title,
}: EmptyStateProps) {
	return (
		<Card>
			<CardContent className="py-8 text-center">
				{title && <p className="font-semibold text-foreground mb-2">{title}</p>}
				<p className="text-muted-foreground">{message}</p>
			</CardContent>
		</Card>
	);
}
