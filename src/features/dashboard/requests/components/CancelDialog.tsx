import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface CancelDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function CancelDialog({
	isOpen,
	onOpenChange,
	onConfirm,
}: CancelDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel Request</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel this request? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Keep Request
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Cancel Request
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
