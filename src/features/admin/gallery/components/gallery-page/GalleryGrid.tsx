import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/image-zoom";

export type CrochetListItem = {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number | null;
	isVisible: boolean;
	createdAt: Date;
	imagePath: string;
	imageUrl: string | null;
};

interface GalleryGridProps {
	items: CrochetListItem[];
	onToggleVisibility: (item: CrochetListItem) => void | Promise<void>;
	onEdit: (item: CrochetListItem) => void;
	onDelete: (item: CrochetListItem) => void;
}

export function GalleryGrid({
	items,
	onToggleVisibility,
	onEdit,
	onDelete,
}: GalleryGridProps) {
	if (items.length === 0) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<p className="text-muted-foreground">
						No items found. Try adjusting your filters or add a new item.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{items.map((item) => (
				<Card key={item.id} className={item.isVisible ? "" : "opacity-60"}>
					<div className="aspect-video relative overflow-hidden rounded-t-lg">
						{item.imageUrl ? (
							<ImageZoom>
								<img
									src={item.imageUrl}
									alt={item.name}
									className="w-full h-full object-cover"
								/>
							</ImageZoom>
						) : (
							<div className="w-full h-full bg-muted" />
						)}
					</div>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div>
								<CardTitle className="text-lg">{item.name}</CardTitle>
								<CardDescription>{item.category}</CardDescription>
							</div>
							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onToggleVisibility(item)}
									title={item.isVisible ? "Hide item" : "Show item"}
								>
									{item.isVisible ? (
										<Eye className="h-4 w-4" />
									) : (
										<EyeOff className="h-4 w-4" />
									)}
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(item)}
									title="Edit item"
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-destructive"
									onClick={() => onDelete(item)}
									title="Delete item"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
							{item.description}
						</p>
						<p className="font-semibold text-lg">
							{item.price ? `₱${item.price.toFixed(2)}` : "No price set"}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
