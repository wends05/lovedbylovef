import { OrderCardShell } from "@/features/orders/components/OrderCardShell";
import { AdminOrderActionsSheet } from "@/features/orders/components/sheets/AdminOrderActionsSheet";
import type { Order } from "@/generated/prisma/client";

interface OrderCardProps {
	order: Order & { user: { name: string | null; email: string } };
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
					<p className="text-sm font-medium">{order.user.name ?? "User"}</p>
					<p className="text-xs text-muted-foreground">{order.user.email}</p>
				</div>
			}
			actions={
				<AdminOrderActionsSheet
					orderId={order.id}
					requestId={order.requestId}
					status={order.status}
					totalPrice={order.totalPrice}
				/>
			}
		/>
	);
}
