import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface CancelConfirmationDialogProps {
	cancelDialogOpen: boolean;
	setCancelDialogOpen: (open: boolean) => void;
	handleCancel: () => Promise<void>;
	isCancelling: boolean;
}

export default function CancelConfirmationDialog({
	cancelDialogOpen,
	setCancelDialogOpen,
	handleCancel,
	isCancelling,
}: CancelConfirmationDialogProps) {
	return (
		<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel Request</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel this request? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setCancelDialogOpen(false)}
						disabled={isCancelling}
					>
						Keep Request
					</Button>
					<Button
						variant="destructive"
						onClick={handleCancel}
						disabled={isCancelling}
					>
						{isCancelling ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Cancelling...
							</>
						) : (
							"Cancel Request"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
