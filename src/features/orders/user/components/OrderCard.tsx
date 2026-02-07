import { Link } from "@tanstack/react-router";
import { MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCardShell } from "@/features/orders/components/OrderCardShell";
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
				<div className="flex gap-2">
					<Button
						size="sm"
						className="flex-1"
						render={
							<Link to="/chat/$orderId" params={{ orderId: order.id }}>
								<MessageCircleMore className="w-4 h-4 mr-2" />
								Chat
							</Link>
						}
					/>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						render={
							<Link to="/request/$id" params={{ id: order.requestId }}>
								View
							</Link>
						}
					/>
				</div>
			}
		/>
	);
}
