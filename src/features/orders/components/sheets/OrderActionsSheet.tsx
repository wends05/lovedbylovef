import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

type OrderActionsSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	orderId: string;
	requestId: string;
	showOrderLink?: boolean;
	showChatLink?: boolean;
	triggerLabel?: string;
	disabled?: boolean;
	children: ReactNode;
};

export function OrderActionsSheet({
	open,
	onOpenChange,
	title,
	description,
	orderId,
	requestId,
	showOrderLink = true,
	showChatLink = true,
	triggerLabel = "Actions",
	disabled = false,
	children,
}: OrderActionsSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger
				disabled={disabled}
				render={<Button variant="outline" size="sm" />}
			>
				{triggerLabel}
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					{description ? <SheetDescription>{description}</SheetDescription> : null}
				</SheetHeader>
				<div className="px-6 space-y-3">{children}</div>
				<SheetFooter className="border-t border-border">
					{showOrderLink ? (
						<Button
							variant="outline"
							className="w-full"
							render={<Link to="/order/$id" params={{ id: orderId }} />}
						>
							View Order
						</Button>
					) : null}
					<Button
						variant="outline"
						className="w-full"
						render={<Link to="/request/$id" params={{ id: requestId }} />}
					>
						View Request
					</Button>
					{showChatLink ? (
						<Button
							variant="outline"
							className="w-full"
							render={<Link to="/chat/$orderId" params={{ orderId }} />}
						>
							Open Chat
						</Button>
					) : null}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
