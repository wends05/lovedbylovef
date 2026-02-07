import { format } from "date-fns";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderStatus } from "@/generated/prisma/enums";

interface OrderCardShellProps {
	orderId: string;
	createdAt: Date | string;
	status: OrderStatus;
	totalPrice: number | null;
	details: ReactNode;
	actions?: ReactNode;
}

export function OrderCardShell({
	orderId,
	createdAt,
	status,
	totalPrice,
	details,
	actions,
}: OrderCardShellProps) {
	return (
		<Card>
			<CardHeader className="pb-3 h-full">
				<CardTitle className="text-lg">#{orderId}</CardTitle>
				<p className="text-sm text-muted-foreground">
					{format(new Date(createdAt), "MMM d, yyyy")}
				</p>
			</CardHeader>
			<CardContent className="space-y-2">
				{details}
				<div className="text-sm text-muted-foreground">
					Status: <span className="font-medium">{status}</span>
				</div>
				<div className="text-sm text-muted-foreground">
					Total:{" "}
					<span className="font-medium">
						{totalPrice ? `₱${totalPrice.toFixed(2)}` : "—"}
					</span>
				</div>
				{actions ? <div className="pt-2">{actions}</div> : null}
			</CardContent>
		</Card>
	);
}
