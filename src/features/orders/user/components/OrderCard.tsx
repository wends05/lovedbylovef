import { OrderCardShell } from "@/features/orders/components/OrderCardShell";
import { UserOrderActionsSheet } from "@/features/orders/components/sheets/UserOrderActionsSheet";
import type { Order } from "@/generated/prisma/client";

interface OrderCardProps {
	order: Order & { request: { title: string; description: string } | null };
}

export function OrderCard({ order }: OrderCardProps) {
	return (
		<OrderCardShell
			orderId={order.id}
			title={order.request?.title ?? "Custom order"}
			createdAt={order.createdAt}
			status={order.status}
			totalPrice={order.totalPrice}
			details={
				<div className="space-y-1">
					<p className="truncate font-mono text-xs text-muted-foreground">
						Order ID: {order.id}
					</p>
					<p className="text-xs text-muted-foreground line-clamp-2">
						{order.request?.description ?? "No description provided"}
					</p>
				</div>
			}
			actions={
				<UserOrderActionsSheet
					orderId={order.id}
					requestId={order.requestId}
					status={order.status}
				/>
			}
		/>
	);
}
