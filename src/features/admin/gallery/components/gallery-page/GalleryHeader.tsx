import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryHeaderProps {
	itemCount: number;
	totalCount: number;
	onCreate: () => void;
}

export function GalleryHeader({
	itemCount,
	totalCount,
	onCreate,
}: GalleryHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Gallery Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage your crochet gallery items ({itemCount} of {totalCount})
				</p>
			</div>

			<Button className="gap-2" onClick={onCreate}>
				<Plus className="h-4 w-4" />
				Add New Item
			</Button>
		</div>
	);
}
