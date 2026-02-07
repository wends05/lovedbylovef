import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/generated/prisma/enums";
import { useOrderLifecycleActions } from "../hooks/useOrderLifecycleActions";
import { OrderActionsSheet } from "./OrderActionsSheet";

type UserOrderActionsSheetProps = {
	orderId: string;
	requestId: string;
	status: OrderStatus;
	canMarkDelivered?: boolean;
	showOrderLink?: boolean;
	showChatLink?: boolean;
	triggerLabel?: string;
};

export function UserOrderActionsSheet({
	orderId,
	requestId,
	status,
	canMarkDelivered = true,
	showOrderLink = true,
	showChatLink = true,
	triggerLabel = "Actions",
}: UserOrderActionsSheetProps) {
	const [open, setOpen] = useState(false);
	const { isUpdating, markAsDelivered } = useOrderLifecycleActions();
	const canDeliver =
		canMarkDelivered && status === OrderStatus.PROCESSING;

	return (
		<OrderActionsSheet
			open={open}
			onOpenChange={setOpen}
			title="Order Actions"
			description="Track and manage your order."
			orderId={orderId}
			requestId={requestId}
			showOrderLink={showOrderLink}
			showChatLink={showChatLink}
			triggerLabel={triggerLabel}
		>
			{canDeliver ? (
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
			) : (
				<p className="text-sm text-muted-foreground">
					No actions available right now.
				</p>
			)}
		</OrderActionsSheet>
	);
}
