import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function DeleteDialog({
	isOpen,
	onOpenChange,
	onConfirm,
}: DeleteDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Request</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this request? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Keep Request
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete Request
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
