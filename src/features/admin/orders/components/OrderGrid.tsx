import type { Order } from "@/generated/prisma/client";
import { OrderCard } from "./OrderCard";

interface OrderGridProps {
	orders: Array<Order & { user: { name: string | null; email: string } }>;
}

export function OrderGrid({ orders }: OrderGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{orders.map((order) => (
				<OrderCard key={order.id} order={order} />
			))}
		</div>
	);
}
