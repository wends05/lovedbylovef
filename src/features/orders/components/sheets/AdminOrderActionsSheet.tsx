import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatus } from "@/generated/prisma/enums";
import { useOrderLifecycleActions } from "../hooks/useOrderLifecycleActions";
import { OrderActionsSheet } from "./OrderActionsSheet";

type AdminOrderActionsSheetProps = {
	orderId: string;
	requestId: string;
	status: OrderStatus;
	totalPrice: number | null;
	showOrderLink?: boolean;
	showChatLink?: boolean;
	triggerLabel?: string;
};

export function AdminOrderActionsSheet({
	orderId,
	requestId,
	status,
	totalPrice,
	showOrderLink = true,
	showChatLink = true,
	triggerLabel = "Actions",
}: AdminOrderActionsSheetProps) {
	const [open, setOpen] = useState(false);
	const [priceInput, setPriceInput] = useState(
		typeof totalPrice === "number" ? String(totalPrice) : "",
	);
	const { isUpdating, markAsProcessing, markAsDelivered } =
		useOrderLifecycleActions();

	const canMarkProcessing = status === OrderStatus.PENDING;
	const canMarkDelivered = status === OrderStatus.PROCESSING;

	return (
		<OrderActionsSheet
			open={open}
			onOpenChange={setOpen}
			title={`#${orderId}`}
			description="Manage lifecycle updates for this order."
			orderId={orderId}
			requestId={requestId}
			showOrderLink={showOrderLink}
			showChatLink={showChatLink}
			triggerLabel={triggerLabel}
		>
			{canMarkProcessing ? (
				<div className="space-y-3">
					<div className="space-y-2">
						<Label htmlFor={`price-${orderId}`}>Total Price (PHP)</Label>
						<Input
							id={`price-${orderId}`}
							type="number"
							min={0}
							step="0.01"
							placeholder="0.00"
							value={priceInput}
							onChange={(event) => setPriceInput(event.target.value)}
							disabled={isUpdating}
						/>
					</div>
					<Button
						className="w-full"
						disabled={isUpdating}
						onClick={async () => {
							const parsedPrice = Number(priceInput);
							if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
								toast.error(
									"Total price is required before processing an order.",
								);
								return;
							}

							const success = await markAsProcessing({
								orderId,
								requestId,
								totalPrice: parsedPrice,
								onSuccess: () => setOpen(false),
							});

							if (success) {
								setPriceInput(String(parsedPrice));
							}
						}}
					>
						Mark as Processing
					</Button>
				</div>
			) : null}

			{canMarkDelivered ? (
				<Button
					className="w-full"
					disabled={isUpdating}
					onClick={async () => {
						await markAsDelivered({
							orderId,
							requestId,
							onSuccess: () => setOpen(false),
						});
					}}
				>
					Mark as Delivered
				</Button>
			) : null}

			{!canMarkProcessing && !canMarkDelivered ? (
				<p className="text-sm text-muted-foreground">
					No actions available for this order status.
				</p>
			) : null}
		</OrderActionsSheet>
	);
}
