import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { OrderCardShell } from "@/features/orders/components/OrderCardShell";
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
				<div className="flex flex-wrap gap-2">
					<Link
						to="/request/$id"
						params={{ id: order.requestId }}
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						View Request
					</Link>
					<Link
						to="/chat/$orderId"
						params={{ orderId: order.id }}
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						Chat
					</Link>
				</div>
			}
		/>
	);
}
