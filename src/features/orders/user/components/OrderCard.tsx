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
			createdAt={order.createdAt}
			status={order.status}
			totalPrice={order.totalPrice}
			details={
				<div>
					<p className="text-sm font-medium">
						{order.request?.title ?? "Custom order"}
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
