import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authMiddleware } from "@/features/auth/middleware";
import { AdminOrderActionsSheet } from "@/features/orders/components/sheets/AdminOrderActionsSheet";
import { UserOrderActionsSheet } from "@/features/orders/components/sheets/UserOrderActionsSheet";
import { ordersQueryOptions } from "@/features/orders/options";

export const Route = createFileRoute("/order/$id")({
	server: {
		middleware: [authMiddleware],
	},
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			ordersQueryOptions.getOrderById(params.id),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = useParams({ from: "/order/$id" });
	const router = useRouter();
	const { data: order } = useSuspenseQuery(ordersQueryOptions.getOrderById(id));

	const handleBack = () => {
		if (router.history.canGoBack()) {
			router.history.back();
			return;
		}

		if (order.isAdmin) {
			router.navigate({ to: "/admin/orders" });
			return;
		}

		router.navigate({ to: "/orders" });
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
			<div className="flex items-center justify-between gap-3">
				<Button variant="ghost" onClick={handleBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				{order.isAdmin ? (
					<AdminOrderActionsSheet
						orderId={order.id}
						requestId={order.requestId}
						status={order.status}
						totalPrice={order.totalPrice}
						showOrderLink={false}
					/>
				) : (
					<UserOrderActionsSheet
						orderId={order.id}
						requestId={order.requestId}
						status={order.status}
						canMarkDelivered={order.isOwner}
						showOrderLink={false}
					/>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Order #{order.id}</CardTitle>
					<CardDescription>
						Created {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>
						Status: <span className="font-medium">{order.status}</span>
					</p>
					<p>
						Total Price:{" "}
						<span className="font-medium">
							{typeof order.totalPrice === "number"
								? `₱${order.totalPrice.toFixed(2)}`
								: "—"}
						</span>
					</p>
					<p>
						Updated:{" "}
						<span className="font-medium">
							{format(new Date(order.updatedAt), "MMM d, yyyy h:mm a")}
						</span>
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Request</CardTitle>
					<CardDescription>Linked custom request information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Title
						</p>
						<p className="text-sm font-medium">
							{order.request?.title ?? "Request"}
						</p>
					</div>
					<Separator />
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Description
						</p>
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">
							{order.request?.description ?? "No request description."}
						</p>
					</div>
					<Separator />
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							render={
								<Link to="/request/$id" params={{ id: order.requestId }} />
							}
						>
							View Request Details
						</Button>
						<Button
							variant="outline"
							size="sm"
							render={
								<Link to="/chat/$orderId" params={{ orderId: order.id }} />
							}
						>
							Open Chat
						</Button>
					</div>
				</CardContent>
			</Card>

			{order.isAdmin ? (
				<Card>
					<CardHeader>
						<CardTitle>Customer</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 text-sm">
						<p className="font-medium">{order.user.name ?? "User"}</p>
						<p className="text-muted-foreground">{order.user.email}</p>
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}
