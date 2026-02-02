import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Mock gallery items
const mockGalleryItems = [
	{
		id: "1",
		name: "Crochet Teddy Bear",
		description: "Handmade teddy bear with soft yarn",
		price: 45.0,
		category: "TOY",
		isVisible: true,
	},
	{
		id: "2",
		name: "Handmade Scarf",
		description: "Cozy winter scarf in multiple colors",
		price: 32.0,
		category: "WEARABLE",
		isVisible: true,
	},
	{
		id: "3",
		name: "Crochet Blanket",
		description: "Large decorative blanket for home",
		price: 89.0,
		category: "HOME_DECOR",
		isVisible: false,
	},
];

export default function GalleryManagement() {
	const [items, setItems] = useState(mockGalleryItems);
	const [isEditing, setIsEditing] = useState(false);
	const [currentItem, setCurrentItem] = useState<
		(typeof mockGalleryItems)[number] | null
	>(null);

	const handleDelete = (id: string) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const handleToggleVisibility = (id: string) => {
		setItems(
			items.map((item) =>
				item.id === id ? { ...item, isVisible: !item.isVisible } : item,
			),
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground font-display">
						Gallery Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage your crochet gallery items
					</p>
				</div>

				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add New Item
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((item) => (
					<Card key={item.id} className={item.isVisible ? "" : "opacity-60"}>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg">{item.name}</CardTitle>
									<CardDescription>{item.category}</CardDescription>
								</div>
								<div className="flex gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleToggleVisibility(item.id)}
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
										onClick={() => {
											setCurrentItem(item);
											setIsEditing(true);
										}}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive"
										onClick={() => handleDelete(item.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-2">
								{item.description}
							</p>
							<p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
