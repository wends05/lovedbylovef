import { Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Mock orders data
const mockOrders = [
	{
		id: "1",
		customer: "Jane Doe",
		email: "jane@example.com",
		item: "Crochet Teddy Bear",
		status: "PENDING",
		date: "2024-01-15",
		total: 45.0,
	},
	{
		id: "2",
		customer: "John Smith",
		email: "john@example.com",
		item: "Handmade Scarf",
		status: "PROCESSING",
		date: "2024-01-14",
		total: 32.0,
	},
	{
		id: "3",
		customer: "Alice Johnson",
		email: "alice@example.com",
		item: "Crochet Blanket",
		status: "SHIPPED",
		date: "2024-01-13",
		total: 89.0,
	},
];

const statusColors: Record<string, string> = {
	PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
	SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
	DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
	CANCELED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrderManagement() {
	const [filterStatus, setFilterStatus] = useState<string | null>("all");

	const filteredOrders =
		filterStatus === "all"
			? mockOrders
			: mockOrders.filter((order) => order.status === filterStatus);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground font-display">
						Order Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage and track all customer orders
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-muted-foreground" />
					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger className="w-45">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Orders</SelectItem>
							<SelectItem value="PENDING">Pending</SelectItem>
							<SelectItem value="PROCESSING">Processing</SelectItem>
							<SelectItem value="SHIPPED">Shipped</SelectItem>
							<SelectItem value="DELIVERED">Delivered</SelectItem>
							<SelectItem value="CANCELED">Canceled</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-lg border border-border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium">#{order.id}</TableCell>
								<TableCell>
									<div>
										<p className="font-medium">{order.customer}</p>
										<p className="text-sm text-muted-foreground">
											{order.email}
										</p>
									</div>
								</TableCell>
								<TableCell>{order.item}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={statusColors[order.status]}
									>
										{order.status}
									</Badge>
								</TableCell>
								<TableCell>{order.date}</TableCell>
								<TableCell>${order.total.toFixed(2)}</TableCell>
								<TableCell className="text-right">
									<Button variant="ghost" size="sm">
										View
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
