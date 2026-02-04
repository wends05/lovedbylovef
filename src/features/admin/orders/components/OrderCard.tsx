import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { Order } from "@/generated/prisma/client";

interface OrderCardProps {
	order: Order & { user: { name: string | null; email: string } };
}

export function OrderCard({ order }: OrderCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Order #{order.id}</CardTitle>
				<p className="text-sm text-muted-foreground">
					{format(new Date(order.createdAt), "MMM d, yyyy")}
				</p>
			</CardHeader>
			<CardContent className="space-y-2">
				<div>
					<p className="text-sm font-medium">{order.user.name ?? "User"}</p>
					<p className="text-xs text-muted-foreground">{order.user.email}</p>
				</div>
				<div className="text-sm text-muted-foreground">
					Status: <span className="font-medium">{order.status}</span>
				</div>
				<div className="text-sm text-muted-foreground">
					Total:{" "}
					<span className="font-medium">
						{order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : "—"}
					</span>
				</div>
				<Link
					to="/chat/$orderId"
					params={{ orderId: order.id }}
					className={buttonVariants({ variant: "outline", size: "sm" })}
				>
					Chat
				</Link>
			</CardContent>
		</Card>
	);
}
